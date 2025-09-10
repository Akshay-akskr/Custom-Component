const publicVapidKey = "BPbx7hccyKAGl_M9b1qZ4ZBip0jaafGAaxUzxhlAzh8kWWqNp75vblrnNCMeOCVIbzAiXFSRZUIlwKR4679woh4";


function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


if('serviceWorker' in navigator) {
    registerServiceWorker().catch(console.log)
}

async function registerServiceWorker() {
    const register = await navigator.serviceWorker.register('./worker.js', {
        scope: '/client/'
    });

    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });
	console.log(JSON.stringify(subscription))
    await fetch("/garmin/registration", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
            "Content-Type": "application/json",
        }
    })
}