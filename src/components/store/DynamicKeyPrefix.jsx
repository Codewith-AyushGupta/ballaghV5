import axios from 'axios';

// Function to fetch the keyPrefix
export async function fetchKeyPrefix(apiUrl, headers) {
    try {
        const response = await axios.get(apiUrl, {
            headers: headers
        });
        if (response.data) {
            let prefix = response.data.companyName;
            return prefix;
        } else {
            throw new Error('No keyPrefix found in the response');
        }
    } catch (error) {
        console.error('Error fetching keyPrefix:', error);
        return 'DefaultPrefix-';
    }
}

// You can directly call fetchKeyPrefix wherever you need it
export async function getKeyPrefix(apiUrl, headers) {
    const prefix = await fetchKeyPrefix(apiUrl, headers);
    return prefix;
}
