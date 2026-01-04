const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// API to save contact data
app.post('/api/contact', (req, res) => {
    const contactData = req.body;
    
    // Read existing data
    let existingData = [];
    try {
        const data = fs.readFileSync('contact-data.json', 'utf8');
        existingData = JSON.parse(data);
    } catch (err) {
        // File doesn't exist yet
    }
    
    // Add new data
    contactData.timestamp = new Date().toISOString();
    contactData.id = Date.now();
    contactData.status = 'new';
    existingData.push(contactData);
    
    // Save to file
    fs.writeFileSync('contact-data.json', JSON.stringify(existingData, null, 2));
    
    res.json({ success: true, message: 'Contact saved successfully' });
});

// API to get all contacts
app.get('/api/contacts', (req, res) => {
    try {
        const data = fs.readFileSync('contact-data.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.json([]);
    }
});

// API to update contact status
app.put('/api/contact/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    
    try {
        const data = fs.readFileSync('contact-data.json', 'utf8');
        let contacts = JSON.parse(data);
        
        const index = contacts.findIndex(c => c.id === id);
        if (index !== -1) {
            contacts[index].status = status;
            fs.writeFileSync('contact-data.json', JSON.stringify(contacts, null, 2));
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Contact not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Website: http://localhost:${PORT}/index.html`);
    console.log(`Admin Panel: http://localhost:${PORT}/admin.html`);
});