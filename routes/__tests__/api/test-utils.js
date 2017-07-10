/**
 * Created by Game Station on 10.7.2017 г..
 */

const clearItems = Model => done => {
	Model.find({})
	.remove(err=>done());
}


const saveOne = Model => model =>
	new Promise((resolve, reject) =>
		new Model(model).save((err, item) =>
			err ? reject(err) : resolve(item)
		)
	);

exports.clearItems = clearItems;
exports.saveOne = saveOne;
