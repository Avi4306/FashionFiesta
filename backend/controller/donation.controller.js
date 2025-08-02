// backend/controllers/donationController.js
import Donation from '../models/donation.model.js';
// No need to import User here, as protect middleware already attaches req.user

// ... (other imports and functions) ...

// @desc    Create a new donation
// @route   POST /api/donations
// @access  Private (Auth required)
const createDonation = async (req, res) => {
    const {
        itemType,
        quantity,
        condition,
        description,
        pickupAddress,
        contactNumber,
        preferredPickupDate,
        preferredPickupTime,
        photos
    } = req.body;

    // Get user ID from the authenticated request (thanks to protect middleware)
    const userId = req.userId;

    try {
        if (Number(quantity) <= 0) {
            return res.status(400).json({ message: 'Quantity must be a positive number.' });
        }

        const newDonation = new Donation({
            itemType,
            quantity: Number(quantity),
            condition,
            description,
            pickupAddress,
            contactNumber,
            preferredPickupDate,
            preferredPickupTime,
            photos,
            user: userId, // Link donation to the user who created it
        });

        const createdDonation = await newDonation.save();

        res.status(201).json({
            message: 'Donation request submitted successfully!',
            donation: createdDonation
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        console.error('Error creating donation:', error);
        res.status(500).json({ message: 'Failed to submit donation.', error: error.message });
    }
};

// @desc    Get all donations
// @route   GET /api/donations
// @access  Private (Admin only) - now for admin dashboard
const getDonations = async (req, res) => {
    try {
        const donations = await Donation.find({}).populate('user', 'name email'); // Populate user info
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve donations.', error: error.message });
    }
};

// @desc    Get donations for the logged-in user
// @route   GET /api/donations/my-donations
// @access  Private (Auth required)
const getMyDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ user: req.userId });
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve your donations.', error: error.message });
    }
};

// @desc    Get single donation by ID
// @route   GET /api/donations/:id
// @access  Public (or Private depending on policy, e.g., only owner/admin)
const getDonationById = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id).populate('user', 'name email');

        if (donation) {
            // Optional: Add a check if req.user is the owner or an admin
            // if (req.user.role === 'admin' || donation.user._id.toString() === req.user._id.toString()) {
            //     res.status(200).json(donation);
            // } else {
            //     res.status(403).json({ message: 'Not authorized to view this donation.' });
            // }
            res.status(200).json(donation); // For now, allow public view or protect via route
        } else {
            res.status(404).json({ message: 'Donation not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve donation.', error: error.message });
    }
};

// @desc    Update a donation (e.g., status update by admin)
// @route   PUT /api/donations/:id
// @access  Private (Admin only, or owner for some fields)
const updateDonation = async (req, res) => {
    const { id } = req.params;
    const {
        itemType,
        quantity,
        condition,
        description,
        pickupAddress,
        contactNumber,
        preferredPickupDate,
        preferredPickupTime,
        photos,
        status
    } = req.body;

    try {
        const donation = await Donation.findById(id);

        if (!donation) {
            return res.status(404).json({ message: 'Donation not found.' });
        }

        // IMPORTANT: Add authorization check here.
        // For example, only admin can change status or delete
        // Only the original user can update their own donation (before it's accepted/scheduled)
        // For simplicity, here we'll assume the route itself is protected by admin for status changes
        // and by owner for content changes if you want to allow that.
        // E.g., if you only want admin to update:
        // if (req.user.role !== 'admin') {
        //     return res.status(403).json({ message: 'Not authorized to update this donation.' });
        // }


        donation.itemType = itemType !== undefined ? itemType : donation.itemType;
        donation.quantity = quantity !== undefined ? Number(quantity) : donation.quantity;
        donation.condition = condition !== undefined ? condition : donation.condition;
        donation.description = description !== undefined ? description : donation.description;
        donation.pickupAddress = pickupAddress !== undefined ? pickupAddress : donation.pickupAddress;
        donation.contactNumber = contactNumber !== undefined ? contactNumber : donation.contactNumber;
        donation.preferredPickupDate = preferredPickupDate !== undefined ? preferredPickupDate : donation.preferredPickupDate;
        donation.preferredPickupTime = preferredPickupTime !== undefined ? preferredPickupTime : donation.preferredPickupTime;
        donation.photos = photos !== undefined ? photos : donation.photos;
        donation.status = status !== undefined ? status : donation.status; // Admin can update status

        const updatedDonation = await donation.save();

        res.status(200).json({
            message: 'Donation updated successfully!',
            donation: updatedDonation
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        console.error('Error updating donation:', error);
        res.status(500).json({ message: 'Failed to update donation.', error: error.message });
    }
};


// @desc    Delete a donation
// @route   DELETE /api/donations/:id
// @access  Private (Admin only)
const deleteDonation = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Donation.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: 'Donation not found.' });
        }

        res.status(200).json({ message: 'Donation deleted successfully.' });

    } catch (error) {
        console.error('Error deleting donation:', error);
        res.status(500).json({ message: 'Failed to delete donation.', error: error.message });
    }
};


export {
    getDonations,
    createDonation,
    getDonationById,
    updateDonation,
    deleteDonation,
    getMyDonations
};