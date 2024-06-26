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

// @desc    Update a delegate by ID
// @route   PUT /delegates/:id
// @access  Public
exports.updateDelegate = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const delegate = await Delegates.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!delegate) {
      return res.status(404).json({ error: "Delegate not found" });
    }

    res.status(200).json(delegate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete a delegate by ID
// @route   DELETE /delegates/:id
// @access  Public
exports.deleteDelegate = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDelegate = await Delegates.findByIdAndDelete(id);

    if (!deletedDelegate) {
      return res.status(404).json({ error: "Delegate not found" });
    }

    res.status(200).json({ message: "Delegate deleted successfully" });
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
      return res
        .status(400)
        .json({ error: "You Are Already Registered For Teen's Meet 2024 !" });
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
പ്രിയപ്പെട്ട ${user.parent_name}

വളർച്ചാവികാസങ്ങളുടെ കരുത്തുറ്റ കൗമാരത്തിന് കാലകോലങ്ങളുടെ  ഇരുട്ടുകളിൽ ഇസ്‌ലാമിൻ്റെ വെളിച്ചം പകർന്നു നൽകുന്നതാണ് ഹയ്യാ ടീൻസ് മീറ്റ്. അറിഞ്ഞും അനുഭവിച്ചും ആസ്വദിച്ചും ആനന്ദിച്ചുമുള്ള മൂന്നു നാൾ അവൻ്റെ ഇസ്‌ലാമികമായ വളർച്ചയിൽ നിർണായക പങ്ക് വഹിക്കുമെന്ന് നമുക്ക് പ്രതീക്ഷിക്കാം...

രക്ഷിതാവ് എന്ന നിലയിൽ അതിലേക്ക് താങ്കളുടെ മകനെ രജിസ്റ്റർ ചെയ്തതിന് അഭിനന്ദനങ്ങൾ.

സ്നേഹത്തോടെ,
Students Islamic Organisation(Sio)
Chungathara area`.replace(/\n\s*\n\s*/g, "\n\n");

    const delegateMessage = `
പ്രിയപ്പെട്ട ${user.full_name}

ഹയ്യാ ടീൻസ് മീറ്റിൽ രജിസ്റ്റർ ചെയ്തതിന് അഭിനന്ദനങ്ങൾ

കനവുകളുടെ കൗമാരത്തെ ഇസ്‌ലാമിനാൽ കരുത്തുറ്റതാക്കുന്നതാണ് ഹയ്യാ ടീൻസ് മീറ്റ്.
സൗഹൃദത്തിൻ്റെ ഹൃദ്യതയിൽ കളിച്ചും ചിരിച്ചും മണ്ണും മനസ്സുമറിഞ്ഞ് ഒന്നിക്കാം നമുക്ക് മൂലേപ്പാടത്ത്.

സ്നേഹത്തോടെ,
Students Islamic Organisation(Sio)
Chungathara area`.replace(/\n\s*\n\s*/g, "\n\n");

    const data = new FormData();
    data.append("type", "text");
    data.append("message", WhatsappMessage);
    data.append("account", process.env.WHATSAPP_ACCOUNT);
    data.append("secret", process.env.WHTSP_ACCESS_TOKEN);

    if (phoneNumber && delegateNumaber) {
      // Check if phoneNumber and delegateNumaber are the same
      if (phoneNumber === delegateNumaber) {
        data.append("recipient", phoneNumber);
      } else {
        const delegate = new FormData();
        delegate.append("type", "text");
        delegate.append("message", delegateMessage);
        delegate.append("recipient", delegateNumaber);
        delegate.append("account", process.env.WHATSAPP_ACCOUNT);
        delegate.append("secret", process.env.WHTSP_ACCESS_TOKEN);

        let config = {
          method: "post",
          url: process.env.WHATSAPP_API_URL,
          data: delegate,
        };

        await axios
          .request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            console.log("message sent to", delegateNumaber);
          })
          .catch((error) => {
            console.log(error);
          });

        data.append("recipient", phoneNumber);
      }
    } else if (phoneNumber) {
      data.append("recipient", phoneNumber);
    } else if (delegateNumaber) {
      data.append("recipient", delegateNumaber);
    } else {
      console.log("Phone number not available");
      return;
    }

    const config = {
      method: "post",
      url: process.env.WHATSAPP_API_URL,
      data: data,
    };

    await axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        console.log("message sent");
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error);
  }
}
