function Shtein() {
	this.trie = Object.create(null);
	this.terminator = "\0";
}

//Adds the word to the trie.
Shtein.prototype.add = function(word) {
	var trie = this.trie;

	//Iterate over each char.
	for(var i = 0; i < word.length; i++) {
		var c = word[i];

		//If it's an unknown prefix, add it.
		if(!(c in trie)) {
			trie[c] = Object.create(null);
		}

		//Go deeper.
		trie = trie[c];
	}

	//Mark the end of the word.
	trie[this.terminator] = 1;
};

//Returns if the trie contains the word.
Shtein.prototype.contains = function(word) {
	var trie = this.trie;

	//Iterate over each char.
	for(var i = 0; i < word.length; i++) {
		var c = word[i];

		if(!(c in trie)) {
			return false;
		}

		trie = trie[c];
	}

	return this.terminator in trie;
};

//Collects ALL words within that trie and puts it into arr.
Shtein.prototype.collect = function(out, prefix, trie) {
	var trie = this.trie;

	//prefix is optional.
	if(prefix === undefined) {
		prefix = '';
	}

	//Is the prefix already a word?
	if(this.terminator in trie) {
		out.push(prefix);
	}

	for(var k in trie) {
		//Walk the trie for all characters except the terminator.
		if(k !== this.terminator) {
			this.collect(out, prefix + k, trie[k]);
		}
	}

	return out;
}

//Returns all words starting with prefix.
Shtein.prototype.startingWith = function(prefix) {
	var trie = this.trie;

	//First find the sub-trie for this prefix.
	for(var i = 0; i < prefix.length; i++) {
		var c = prefix[i];

		if(c in trie) {
			//Go deeper
			trie = trie[c];
		} else {
			//Not found. There's not a single word with this prefix.
			return [];
		}
	}

	var arr = [];

	//Now collect all words in this sub-trie.
	this.collect(arr, prefix, trie);

	return arr;
}

//Collects all words within a given levenshtein distance to word.
//This is done by recursively doing it again with a decremented distance for each operation (substitution, deletion, insertion).
Shtein.prototype.leven = function(out, word, dist) {
	_leven.call(this, out, word, dist, dist, '', this.trie);
}

var _leven = function(out, word, dist, maxDist, prefix, trie) {
	if(trie === undefined) {
		return;
	}

	//We ate all characters of the word.
	if(word.length === 0) {
		//We reached a valid end state.
		if(this.terminator in trie) {
			//Did another operation alrady each this word?
			if(prefix in out) {
				//Did the other operation do it with less operations?
				//TODO: you're counting the distance wrong, bc it's decremented.
				out[prefix] = Math.min(out[prefix], maxDist - dist);
			} else {
				out[prefix] = maxDist - dist;
			}
		}

		return;
	}


	var c = word[0];

	//Are operations left?
	if(dist > 0) {
		//Deletion (we skip the current character).
		_leven(out, word.substr(1), dist - 1, maxDist, prefix, trie);

		//Walk all available paths for insertion.
		for(var k in trie) {
			if(k !== this.terminator) {
				//Insertions.
				_leven(out, k + word.substr(1), dist - 1, maxDist, prefix, trie);
			}
		}

		//TODO: what bout substitution?
	}

	_leven(out, word.substr(1), dist, maxDist, prefix + c, trie[c]);
};

module.exports = Shtein;