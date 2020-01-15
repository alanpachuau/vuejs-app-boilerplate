const functions = require('firebase-functions');
const admin = require('firebase-admin');
// const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});
const md5 = require('md5');

admin.initializeApp()

exports.authenticate = functions.https.onRequest(async (request, response) => {
    return cors(request, response, async () => {
        let userId = request.query.uid;


        let doc = await admin.firestore().collection('users').doc(userId).get()

        let additionalClaims = {
            role: doc.data().role,
            name: doc.data().name,
            isAdmin: doc.data().role === 'admin',
        };

        let customToken = await admin.auth().createCustomToken(userId, additionalClaims)

        return response.send(customToken)
    });
});

exports.createUser = functions.https.onRequest(async (request, response) => {
    return cors(request, response, async () => {
        if (request.method !== "POST") {
            response.status(400).send('Please send a POST request');
            return;
        }

        let data = request.body

        let userRecord = await admin.auth().createUser({
            email: data.email,
            emailVerified: true,
            password: data.password,
            displayName: data.name,
            disabled: false
        })

        await admin.firestore().collection('users').doc(userRecord.uid).set({
            name: data.name,
            email: data.email,
            role: data.role,
            mobile: (typeof data.mobile !== 'undefined') ? data.mobile : '',
            created: Date.now()
        })

        return response.send(userRecord.uid)
    })
})

exports.eraseUser = functions.https.onRequest((request, response) => {
    return cors(request, response, async () => {
        if (request.method !== "POST") {
            response.status(400).send('Please send a POST request');
            return;
        }

        let userId = request.body.uid

        await admin.auth().deleteUser(userId)

        await admin.firestore().collection('users').doc(userId).delete()

        return response.send(userId)
    })
})

exports.updateUser = functions.https.onRequest((request, response) => {
    return cors(request, response, async () => {
        if (request.method !== "POST") {
            response.status(400).send('Please send a POST request');
            return;
        }

        let data = request.body
        let userId = data.id

        let updates = {
            email: data.email,
            emailVerified: true,
            displayName: data.name,
            disabled: false
        }

        if (typeof data.password !== 'undefined' && data.password.length) {
            updates['password'] = data.password;
        }

        let userRecord = await admin.auth().updateUser(userId, updates);

        await admin.firestore().collection('users').doc(userRecord.uid).set({
            name: data.name,
            email: data.email,
            role: data.role,
            mobile: (typeof data.mobile !== 'undefined') ? data.mobile : '',
            updated: Date.now()
        }, {merge: true})

        return response.send(userRecord.uid)
    })
})

// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'edufix2019@gmail.com',
//         pass: 'EduFix#2019'
//     }
// });


exports.sendResetPasswordLink = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        if (request.method !== "POST") {
            response.status(400).send('Please send a POST request');
            return;
        }

        let data = request.body

        admin.firestore().collection('users').where('email', '==', data.email).limit(1).get()
            .then(function(snapshot) {
                if(snapshot.size) {
                    let doc = snapshot.docs[0]

                    let token = md5(doc.data().email + Date.now())

                    const mailOptions = {
                        from: 'No-Reply <no-reply@firebaseapp.com>',
                        to: data.email,
                        subject: 'Reset Password EduFix', // email subject
                        html: `<p style="font-size: 14px;">Click the link below to reset your password.</p>
                            <br />
                            <p style="font-size: 14px;">
                            <a target="_blank" href="https://app.web.app/new-password?token=` + token + `">https://app.web.app/new-password?token=` + token + `</a>
                            </p>
                            `
                    };

                    return admin.firestore().collection('users').doc(doc.id).set({
                        resetToken: token,
                    }, {merge: true})

                    // return transporter.sendMail(mailOptions, (error, info) => {
                    //     if(error){
                    //         return response.send(erro.toString());
                    //     }
                    //     return response.send('Sent');
                    // });
                } else {
                    return response.send('email not found');
                }
            })
            .catch(function(error){
                console.log(error)
            })

    })
})

exports.eraseAppUser = functions.https.onRequest((request, response) => {
    return cors(request, response, async () => {
        if (request.method !== "POST") {
            response.status(400).send('Please send a POST request');
            return;
        }

        let userId = request.body.uid

        await admin.auth().deleteUser(userId)

        await admin.firestore().collection('appUsers').doc(userId).delete()

        return response.send(userId)
    })
})