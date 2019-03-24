/*
	OpenRepo is made available under the MIT License.

	Copyright (c) 2019 Zenith <zenithdevs.com>

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

class OpenRepo {
	constructor(key, defaultItems, storageHandler) {
		this.key = key;
		this.defaultItems = defaultItems;
		this.storageHandler = (storageHandler != null) ? storageHandler : localStorage;
		if (this.storageHandler.getItem(this.key) === null) {
	      this.storageHandler.setItem(this.key, (this.defaultItems != null) ? JSON.stringify(this.defaultItems) : JSON.stringify([]));
	    }
	}
	add(url) {
		var repos = JSON.parse(this.storageHandler.getItem(this.key));
	    repos.push(this.patch(url));
	    this.storageHandler.setItem(this.key, JSON.stringify(this.clean(repos)));
	}
	remove(item) {
	    var repos = JSON.parse(this.storageHandler.getItem(this.key));
		switch (typeof item) {
			case "number": 
		        repos.splice(i, 1);
		        this.storageHandler.setItem(this.key, JSON.stringify(repos));
				break;
			case "string":
				repos.forEach((repo, i) => {
			      	if (repo == item) {
				        repos.splice(i, 1);
				        this.storageHandler.setItem(this.key, JSON.stringify(repos));
				    }
				});
				break;
			default:
				break;
		}
	}
	reset() {
		this.storageHandler.removeItem(this.key);
		if (this.storageHandler.getItem(this.key) === null) {
	    	this.storageHandler.setItem(this.key, (this.defaultItems != null) ? JSON.stringify(this.defaultItems) : JSON.stringify([]));
	    }
	}
	get(url) {
		var self = this;
		return new Promise(function(resolve, reject) {
			fetch(url).then(res => res.json()).then(json => {
		        resolve(self.patch(data));
			}).catch(err => {
				reject(err);
			});
	  	});
	}
	list(fetchAll) {
		var self = this;
        var repos = JSON.parse(this.storageHandler.getItem(self.key));
		return (new Promise((resolve, reject) => {
			var result = [];
			var loadedRepos = 0;
            if (repos.length > 0 && fetchAll == true) {
              	repos.forEach(repo => {
	                fetch(repo).then(res => res.json()).then(json => {
	                	result.push(json);
	                  	loadedRepos++;
	                  	if (loadedRepos == repos.length) {
	                  		resolve(result);
	                  	}
	                }).catch(err => {
	                  	console.error(err);
	                  	loadedRepos++;
	                  	if (loadedRepos == repos.length) {
	                    	resolve(result);
	                  	}
                	});
              	});
			} else {
	        	resolve(repos);
            }
    	}));
	}
	patch(item) {
		var self = this;
		switch (typeof item) {
		    case "string":
		    	return item.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/\\/g, "&#92;").replace(/`/g, "&#96;");
		    	break;
		    case "object":
		    	var object = item;
		    	Object.keys(object).forEach(keys => {
			        object[key] = self.patch(object[key]);
		    	});
		      	return object;
		      	break;
		    default:
		    	return item;
	  	}
	}
	clean(arr) {
		return arr.filter(function(elem, index, self) {
		    return index === self.indexOf(elem);
		});
	}
}