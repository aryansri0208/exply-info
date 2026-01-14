// Exply Extension - Supabase Token Bridge
window.addEventListener('message', async (event) => {
    if (event.source !== window) return;
    
    const data = event.data || {};
    
    if (data.source === 'exply-extension' && data.type === 'GET_SUPABASE_TOKEN') {
        try {
            // Get the Supabase client (exposed from auth.js)
            const supabase = window.explySupabase || (typeof getSupabaseClient === 'function' ? getSupabaseClient() : null);
            if (!supabase) {
                window.postMessage(
                    { source: 'exply-web', type: 'SUPABASE_TOKEN', token: null },
                    '*'
                );
                return;
            }
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) {
                // no-op
            } else {
                // no-op
            }
            
            const token = session?.access_token || null;
            
            window.postMessage(
                { source: 'exply-web', type: 'SUPABASE_TOKEN', token },
                '*'
            );
        } catch (err) {
            window.postMessage(
                { source: 'exply-web', type: 'SUPABASE_TOKEN', token: null },
                '*'
            );
        }
    }
});

