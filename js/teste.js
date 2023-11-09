const firebaseConfig = {
    apiKey: "AIzaSyAhsgy-3hgII6JVv91m6HBkOatM84br7TI",
    authDomain: "dashboard-de-vendas-a9c6a.firebaseapp.com",
    projectId: "dashboard-de-vendas-a9c6a",
    messagingSenderId: "1031844698931",
    appId: "1:1031844698931:web:5f79e7b14f4c4ac399fc46",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.requestPermission().then(() => {
    console.log('Permissão concedida');
    return messaging.getToken();
}).then((token) => {
    console.log('Token FCM:', token);
    // Envie o token para o servidor para associá-lo ao usuário
}).catch((error) => {
    console.error('Erro ao solicitar permissão:', error);
});

const admin = require('firebase-admin');

const serviceAccount = require('caminho/para/sua/chave-de-servico.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const message = {
    notification: {
        title: 'Título da Notificação',
        body: 'Corpo da Notificação',
    },
    // Pode incluir dados adicionais aqui
};

admin.messaging().sendToTopic('nome-do-topico', message)
    .then((response) => {
        console.log('Mensagem enviada com sucesso:', response);
    })
    .catch((error) => {
        console.error('Erro ao enviar mensagem:', error);
    });

    const user = auth.currentUser;
user.getIdToken().then((token) => {
    // Envie o token para o seu servidor para associá-lo ao usuário
});