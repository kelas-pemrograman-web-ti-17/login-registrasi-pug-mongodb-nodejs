const mongoose = require('mongoose');
const bukuSchema = mongoose.Schema({
    kodebuku        : {type: String, unique: true},
    judulbuku 		: String,
    sinopsis 	    : String,
    pengarang	    : String,
    harga	        : String,
    created_at		: String
});
module.exports = mongoose.model('buku', bukuSchema);
