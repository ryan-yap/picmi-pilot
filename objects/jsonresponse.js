function JsonResponse(data, type, url, method, uid, error) {
	this.head = {
		type : type,
		url	: url,
		method : method,
		uid : uid 
	};
	this.data = data;
	this.error = error;
}

module.exports = JsonResponse;