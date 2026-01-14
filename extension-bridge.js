// Extension Bridge - Handles communication between website and Exply extension
// This script runs on the website and provides the Supabase JWT token to the extension

(function() {
    'use strict';
    
    // Listen for messages from the extension requesting the Supabase token
    window.addEventListener('message', async (event) => {
        // Security: Only accept messages from the same window
        if (event.source !== window) return;
        
        const data = event.data || {};
        
        // Check if this is a token request from the extension
        if (data.source === 'exply-extension' && data.type === 'GET_SUPABASE_TOKEN') {
            try {
                const client = getSupabaseClient();
                let token = null;
                
                if (client) {
                    // Get the current session and extract the access token
                    const { data: { session }, error } = await client.auth.getSession();
                    if (session && session.access_token) {
                        token = session.access_token;
                    }
                }
                
                // Send the token back to the extension
                window.postMessage(
                    {
                        source: 'exply-web',
                        type: 'SUPABASE_TOKEN',
                        token: token
                    },
                    '*'
                );
            } catch (error) {
                console.error('Error getting Supabase token:', error);
                // Send null token on error
                window.postMessage(
                    {
                        source: 'exply-web',
                        type: 'SUPABASE_TOKEN',
                        token: null
                    },
                    '*'
                );
            }
        }
    });
    
    console.log('Exply extension bridge initialized');
})();

