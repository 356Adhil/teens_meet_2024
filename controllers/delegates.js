const Delegates = require("../models/Delegates");
const axios = require("axios");
const FormData = require("form-data");

// @desc    Get all delegates
// @route   GET /delegates
// @access  Public
exports.getDelegates = async (req, res) => {
  try {
    const delegates = await Delegates.find();

    res.status(200).json(delegates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get a delegate
// @route   GET /delegates/:id
// @access  Public
exports.getDelegate = async (req, res) => {
  try {
    const delegate = await Delegates.findById(req.params.id);

    if (!delegate) {
      return res.status(404).json({ message: "Delegate not found" });
    }

    res.status(200).json(delegate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create a delegate
// @route   POST /delegates
// @access  Public
exports.createDelegate = async (req, res) => {
  try {
    const existingMobile = await Delegates.findOne({ mobile: req.body.mobile });
    if (existingMobile) {
      return res.status(400).json({ error: "You Are Already Registered For Teen's Meet 2024 !" });
    }

    const existingEmail = await Delegates.findOne({ email: req.body.email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // If validation passes, save the data to the database
    const delegate = await Delegates.create(req.body);

    if (delegate) {
      await sendWhatsAppMessaging(delegate);
    }

    // Send success response
    return res
      .status(201)
      .json({ message: "Registration Completed", delegate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function sendWhatsAppMessaging(user) {
  try {
    let phoneNumber = String(user.parent_mobile);
    let delegateNumaber = String(user.mobile);
    const regex = /[ +]/g;
    phoneNumber = phoneNumber.replace(regex, "");
    delegateNumaber = delegateNumaber.replace(regex, "");

    if (!phoneNumber.startsWith("91")) {
      phoneNumber = "91" + phoneNumber;
    }
    if (!delegateNumaber.startsWith("91")) {
      delegateNumaber = "91" + delegateNumaber;
    }
    console.log({ phoneNumber });
    console.log({ delegateNumaber });

    const WhatsappMessage = `
🌟 Thank you for Registering Teens Meet 2024! 🌟

Hi ${user.full_name},

Thank you for helping us test our registration for Teens Meet 2024. Your feedback is crucial to improving our platform.

Best Regards,
Innovation Edge`.replace(/\n\s*\n\s*/g, "\n\n");

    const data = new FormData();
    data.append("type", "text");
    data.append("message", WhatsappMessage);
    data.append("recipient", phoneNumber);
    data.append("account", process.env.WHATSAPP_ACCOUNT);
    data.append("secret", process.env.WHTSP_ACCESS_TOKEN);

    let config = {
      method: "post",
      url: process.env.WHATSAPP_API_URL,
      data: data,
    };

    await axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });

    const delegate = new FormData();
    delegate.append("type", "text");
    delegate.append("message", WhatsappMessage);
    delegate.append("recipient", delegateNumaber);
    delegate.append("account", process.env.WHATSAPP_ACCOUNT);
    delegate.append("secret", process.env.WHTSP_ACCESS_TOKEN);

    config = {
      method: "post",
      url: process.env.WHATSAPP_API_URL,
      data: delegate,
    };

    await axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error);
  }
}
