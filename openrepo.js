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
	constructor(key, defaultItems) {
		this.key = key;
		this.defaultItems = defaultItems;
		if (localStorage.getItem(this.key) === null) {
      localStorage.setItem(this.key, (this.defaultItems != null) ? JSON.stringify(this.defaultItems) : JSON.stringify([]));
    }
	}
	add(url) {
		var repos = JSON.parse(localStorage.getItem(this.key));
    repos.push(this.patch(url));
    localStorage.setItem(key, JSON.stringify(repos.clean()));
	}
	remove(item) {
    var repos = JSON.parse(localStorage.getItem(this.key));
		switch (typeof item) {
			case "number": 
        repos.splice(i, 1);
        localStorage.setItem(this.key, JSON.stringify(repos));
				break;
			case "string":
				for (var i = 0; i < repos.length; i++) {
		      if (repos[i] == item) {
		        repos.splice(i, 1);
		        localStorage.setItem(this.key, JSON.stringify(repos));
		      }
		    }
				break;
			default:
				break;
		}
	}
	reset() {
		localStorage.removeItem(this.key);
		if (localStorage.getItem(this.key) === null) {
      localStorage.setItem(this.key, (this.defaultItems != null) ? JSON.stringify(this.defaultItems) : JSON.stringify([]));
    }
	}
	get(url) {
		var self = this;
		return new Promise(function(resolve, reject) {
	    var xhr = new XMLHttpRequest();
	    xhr.open("GET", url);
	    xhr.onload = function() {
	      if (this.status >= 200 && this.status < 300) {
	      	try {
	      		var data = JSON.parse(xhr.response);
		        resolve(self.patch(data));
	      	} catch(err) {
	      		reject({
		          status: this.status,
		          statusText: "Unable to parse JSON."
		        });
	      	}
	      } else {
	        reject({
	          status: this.status,
	          statusText: xhr.statusText
	        });
	      }
	    };
	    xhr.onerror = function() {
	      reject({
	        status: this.status,
	        statusText: xhr.statusText
	      });
	    };
	    xhr.send();
	  });
  }
	list(fetchAll) {
		var self = this;
		try {
			var list = [];
			var repos = JSON.parse(localStorage.getItem(self.key));	
			if (fetchAll == true) {
				return new Promise(function(resolve, reject) {
					var reposLoaded = 0;
					repos.forEach((repo) => {
						self.get(repo).then(function(data) {
							list.push(data);
							reposLoaded++;
							if (reposLoaded == repos.length) {
								resolve(list);
							}
						}).catch(function(err) {
							console.log(err);
						});
					});
				});
			} else {
				return new Promise(function(resolve, reject) {
					resolve(repos);
				});
			}
		} catch (err) {
			console.error(err);
		}
	}
	patch(item) {
		var self = this;
		switch (typeof item) {
	    case "string":
	      return item.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/\\/g, "&#92;").replace(/`/g, "&#96;");
	      break;
	    case "object":
	      var object = item;
	      var keys = Object.keys(object);
	      for (var i = 0; i < keys.length; i++) {
	        object[keys[i]] = self.patch(object[keys[i]]);
	      }
	      return object;
	      break;
	    default:
	      return item;
	  }
	}
}