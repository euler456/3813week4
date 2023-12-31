
module.exports = function(db, app, client ) {
    app.post('/login', async function(req, res) {
        await client.connect();
        if (!req.body) {
            return res.sendStatus(400);
          }
        const u = req.body.email;
        const p = req.body.pwd;
        let user = await db.collection('users').findOne({ email: u, password: p })
            if (user) {
                res.send({
                    valid: true,
                    user: {
                        userid: user.userid,
                        username: user.username,
                        roles: user.roles,
                        groups: user.groups,
                        email: user.email,
                        filename:user.filename
                    }
                });
            } else {
                res.send({ valid: false });
            }

        client.close();

    });
};
