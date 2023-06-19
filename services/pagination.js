const pagination = (page=1, size=3) => {

    if (page < 1)  page = 1;
    if (size < 1) size = 1;

    const limit = size;
    const skip = (page - 1) * size;
    return { limit,skip };
}

export default pagination;

/*
const {page,size} = req.body;
const {limit,skip} = pagination(page,size);
.limit(limit).skip(skip).sort({name:1});
res.status(200).json({msg:"done",
    data: {
        users,
        total:users.length
    },meta: {
        skip,
        limit
        }
    });
* */