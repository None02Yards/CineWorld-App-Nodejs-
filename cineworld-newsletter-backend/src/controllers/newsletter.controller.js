const Subscriber = require('../models/subscriber.model');
const { generateToken } = require('../utils/token.util');
const { sendConfirmationEmail } = require('../services/email.service');


// =========================
// SUBSCRIBE
// =========================
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // Basic validation
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    console.log('📩 New subscription request:', email);

    // Check if already verified
    const existing = await Subscriber.findOne({ email });

    if (existing && existing.isVerified) {
      return res.status(400).json({ message: 'Already subscribed.' });
    }

    // Generate verification token
    const token = generateToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    // Create or update subscriber
    const subscriber = await Subscriber.findOneAndUpdate(
      { email },
      {
        email,
        verificationToken: token,
        tokenExpires: expires,
        isVerified: false
      },
      {
        upsert: true,
        returnDocument: 'after' // ✅ modern mongoose
      }
    );

    console.log('🧾 Subscriber saved:', subscriber.email);

    // Send confirmation email
    await sendConfirmationEmail(email, token);

    console.log('✅ Confirmation email sent to:', email);

    return res.status(200).json({
      success: true,
      message: 'Confirmation email sent.'
    });

  } catch (err) {
    console.error('❌ Subscribe error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while subscribing.'
    });
  }
};



// =========================
// CONFIRM EMAIL
// =========================
exports.confirm = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: 'Token is required.' });
    }

    const subscriber = await Subscriber.findOne({
      verificationToken: token,
      tokenExpires: { $gt: new Date() }
    });

    if (!subscriber) {
      return res.status(400).send('Invalid or expired token.');
    }

    subscriber.isVerified = true;
    subscriber.verificationToken = null;
    subscriber.tokenExpires = null;

    await subscriber.save();

    console.log('🎉 Email confirmed:', subscriber.email);

    return res.send(`
      <h2>Email successfully confirmed 🎉</h2>
      <p>You are now subscribed to CineWorld newsletter.</p>
    `);

  } catch (err) {
    console.error('❌ Confirm error:', err);
    return res.status(500).send('Server error.');
  }
};
