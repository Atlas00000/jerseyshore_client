/**
 * Test script to verify the model loads from Cloudflare R2
 * Run this after uploading the model to R2
 */

const MODEL_URL = 'https://pub-42d9986d97a0490598cb89136641b713.r2.dev/models/blank/blank-shirt.glb';

async function testModelLoad() {
  try {
    console.log('Testing model load from:', MODEL_URL);
    console.log('Fetching model...');

    const response = await fetch(MODEL_URL, {
      method: 'HEAD', // Just check if file exists
    });

    if (response.ok) {
      console.log('✅ Model is accessible!');
      console.log('Content-Type:', response.headers.get('content-type'));
      console.log('Content-Length:', response.headers.get('content-length'));
      console.log('\nYou can now test loading it in the 3D viewer.');
    } else {
      console.log('❌ Model not found or not accessible');
      console.log('Status:', response.status, response.statusText);
      console.log('\nPlease upload the model to R2 first.');
    }
  } catch (error) {
    console.error('❌ Error testing model load:', error);
  }
}

testModelLoad();



