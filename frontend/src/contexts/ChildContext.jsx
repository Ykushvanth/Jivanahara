import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const ChildContext = createContext();

export function ChildProvider({ children }) {
  const [selectedChild, setSelectedChild] = useState(null);
  const [childrenList, setChildrenList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchChildren(session.user.id);
      } else {
        setChildrenList([]);
        setSelectedChild(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      await fetchChildren(user.id);
    }
    setLoading(false);
  };

  const fetchChildren = async (authUserId) => {
    try {
      console.log('🔍 Fetching children for auth user ID:', authUserId);

      // First, get the parent record using the auth user ID
      const { data: parentData, error: parentError } = await supabase
        .from('parents')
        .select('id')
        .eq('password_hash', authUserId)
        .eq('status', 'active')
        .single();

      if (parentError) {
        console.error('❌ Error fetching parent:', parentError);
        setChildrenList([]);
        return;
      }

      if (!parentData) {
        console.warn('⚠️ No parent record found for this auth user ID');
        console.log('💡 Check if parents table has a record with password_hash =', authUserId);
        setChildrenList([]);
        return;
      }

      console.log('✅ Found parent record with ID:', parentData.id);

      // Now fetch children using the parent's ID
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', parentData.id)
        .eq('status', 'active')
        .order('created_at');

      if (error) throw error;

      console.log('📋 Found children:', data?.length || 0);
      console.log('Children data:', data);

      // Transform the data to use consistent field names
      const transformedChildren = (data || []).map(child => ({
        ...child,
        name: child.student_name, // Map student_name to name for easier use
      }));

      setChildrenList(transformedChildren);

      // Auto-select first child if none selected
      if (transformedChildren && transformedChildren.length > 0 && !selectedChild) {
        console.log('✅ Auto-selecting first child:', transformedChildren[0].name);
        setSelectedChild(transformedChildren[0]);
      } else if (transformedChildren.length === 0) {
        console.warn('⚠️ No active children found for parent ID:', parentData.id);
      }
    } catch (error) {
      console.error('❌ Error fetching children:', error);
      setChildrenList([]);
    }
  };

  const selectChild = (child) => {
    setSelectedChild(child);
    // Store in localStorage for persistence
    if (child) {
      localStorage.setItem('selectedChildId', child.id.toString());
    }
  };

  const refreshChildren = async () => {
    if (user) {
      await fetchChildren(user.id);
    }
  };

  return (
    <ChildContext.Provider
      value={{
        selectedChild,
        childrenList,
        loading,
        selectChild,
        refreshChildren,
      }}
    >
      {children}
    </ChildContext.Provider>
  );
}

export function useChild() {
  const context = useContext(ChildContext);
  if (context === undefined) {
    throw new Error('useChild must be used within a ChildProvider');
  }
  return context;
}
