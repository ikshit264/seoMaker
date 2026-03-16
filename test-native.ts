import { MongoClient } from 'mongodb';
import dns from 'dns';

// Try the DNS workaround
dns.setDefaultResultOrder('ipv4first');

async function testNative() {
    const url = 'mongodb+srv://ikshittalera:ikshittalera@cluster0.kbot2rm.mongodb.net/upvote?retryWrites=true&w=majority&appName=Cluster0';
    console.log('Testing native driver with IPv4 first...');
    const client = new MongoClient(url);
    try {
        await client.connect();
        await client.db().command({ ping: 1 });
        console.log('Native connection success!');
    } catch (err) {
        console.error('Native connection failed!', err);
    } finally {
        await client.close();
    }
}

testNative();
