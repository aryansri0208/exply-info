// Exply Extension - Supabase Token Bridge
console.log('[Exply Bridge] Extension bridge script loaded');

window.addEventListener('message', async (event) => {
    if (event.source !== window) return;
    
    const data = event.data || {};
    console.log('[Exply Bridge] Received message:', data);
    
    if (data.source === 'exply-extension' && data.type === 'GET_SUPABASE_TOKEN') {
        console.log('[Exply Bridge] Token request received from extension');
        
        try {
            // Get the Supabase client (exposed from auth.js)
            const supabase = window.explySupabase || (typeof getSupabaseClient === 'function' ? getSupabaseClient() : null);
            
            console.log('[Exply Bridge] Supabase client available:', !!supabase);
            console.log('[Exply Bridge] window.explySupabase:', !!window.explySupabase);
            console.log('[Exply Bridge] getSupabaseClient function available:', typeof getSupabaseClient === 'function');
            
            if (!supabase) {
                console.warn('[Exply Bridge] No Supabase client found, sending null token');
                window.postMessage(
                    { source: 'exply-web', type: 'SUPABASE_TOKEN', token: null },
                    '*'
                );
                return;
            }
            
            console.log('[Exply Bridge] Getting session...');
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) {
                console.error('[Exply Bridge] Error getting session:', error);
            } else {
                console.log('[Exply Bridge] Session exists:', !!session);
                console.log('[Exply Bridge] Session user:', session?.user?.email || 'No user');
            }
            
            const token = session?.access_token || null;
            console.log('[Exply Bridge] Token retrieved:', token ? `${token.substring(0, 20)}...` : 'null');
            
            window.postMessage(
                { source: 'exply-web', type: 'SUPABASE_TOKEN', token },
                '*'
            );
            console.log('[Exply Bridge] Token sent to extension');
        } catch (err) {
            console.error('[Exply Bridge] Error getting Supabase token:', err);
            window.postMessage(
                { source: 'exply-web', type: 'SUPABASE_TOKEN', token: null },
                '*'
            );
        }
    }
});

