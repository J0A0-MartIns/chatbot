const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = async (req, res) => {
    const { email, senha } = req.body;
    const user = await User.findOne({ where: { email, aprovado: true } });
    if (!user || !bcrypt.compareSync(senha, user.senha)) {
        return res.status(401).json({ message: 'Credenciais incorretas' });
    }
    const token = jwt.sign({ id: user.id, perfil: user.perfil }, process.env.JWT_SECRET);
    res.json({ token, user });
};
