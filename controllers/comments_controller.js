const Comment=require("../models/comment");
const Post=require("../models/post")


module.exports.create=async function(req,res){

    try{
        let post=await Post.findById(req.body.post);

        if(post){
            console.log('succccccccessssssssssssssssssssssssssss');

            let comment=await Comment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id
            });

                post.comments.push(comment);
                post.save();
                console.log(req.xhr,"kkkkkkk");
                comment = await comment.populate('user', 'name');
                console.log(comment);
                if (req.xhr){
                    // Similar for comments to fetch the user's id!
                    
                    
                    return res.status(200).json({
                        data: {
                            comment: comment
                        },
                        message: "Comment created!"
                    });
                }

                req.flash('success', 'Comment published!');
                return res.redirect('/');
            
        }
        else{
            console.log('failewwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwd');
            return res.redirect('/');
        }
    }
    catch(err){
        console.log('err',err);
        return;
    }
    
}



module.exports.destroy=async function(req,res){
    try{
        let comment=await   Comment.findById(req.params.id)
        if(comment.user==req.user.id){
            
            let postId=comment.post;

            comment.remove();

            let post=Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}})
            console.log(req.xhr,"fffffffffff");
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }   
            req.flash('success', 'Comment deleted!');
            return res.redirect('back');
        
        }
        else{
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    }
    catch(err)
    {
        req.flash('error', err);
        return;
    }

}