const prisma = require('../config/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


exports.register = async (req, res) => {
    try {
        const { email, password } = req.body

        // Step 1 Validate body
        if (!email) {
            return res.status(400).json({ message: 'Email is required' })
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' })
        }
        if (!password) {
            return res.status(400).json({ message: 'Password is required' })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' })
        }

        // Step 2 Check Email in DB already?
        const normalizedEmail = email.trim().toLowerCase()
        const existing = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        })
        if (existing) {
            return res.status(400).json({ message: 'Email already exists' })
        }

        // Step 3 Hash password
        const hashPassword = await bcrypt.hash(password, 10)

        // Step 4 Create user
        await prisma.user.create({
            data: {
                email: normalizedEmail,
                password: hashPassword,
                updatedAt: new Date()
            }
        })

        res.json({ message: 'Register Success' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.login = async (req, res) => {
    try {
        //code
        const { email, password } = req.body
        // Step 1 Check Email
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        if (!user || !user.enabled) {
            return res.status(400).json({ message: 'User Not found or not Enabled' })
        }
        // Step 2 Check password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Password Invalid!!!' })
        }
        // Step 3 Create Payload
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        }
        // Step 4 Generate Token
        if (!process.env.SECRET) {
            console.error("SECRET env variable is not set!")
            return res.status(500).json({ message: "Server config error: SECRET missing" })
        }
        jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) {
                console.error("JWT sign error:", err)
                return res.status(500).json({ message: "Token error: " + err.message })
            }
            res.json({ payload, token })
        })
    } catch (err) {
        console.error("Login error:", err)
        res.status(500).json({ message: err.message || "Server Error" })
    }
}
exports.currentuser = async (req, res) => {
    try {
        console.log("req.user:", req.user) 
        //code
        const user = await prisma.user.findFirst({
            where: { email: req.user.email },
            select: {
                id: true,
                email: true,
                name: true,
                role: true
            }
        })
        res.json({ user })
    } catch (err) {
        //err
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}