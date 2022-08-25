{
  //method to submit the form data using the ajaz
  let createPost = function () {
    let newPostForm = $("#new-post-form");
    newPostForm.submit(function (e) {
        e.preventDefault();
        
        $.ajax({
        type: "post",
        url: "/posts/create",
        data: newPostForm.serialize(),
        success: function (data) {
            // console.log(data);
            let newPost=newPostDom(data.data.post);
            $('#post-list-container>ul').prepend(newPost);
            deletePost($(' .delete-post-button',newPost));
            //call the create comment class
            console.log(data.data.post._id);
            new PostComments(data.data.post._id);

                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
        },
        error: function (error) {
            console.log(error.responseText);
        },
      });
    });
    };

  //method to create a post in dom
  let newPostDom = function (post) {
    return $(`
        <li id="post-${post._id}">
                    
        
            <small>
                <a class="delete-post-button" href="/posts/destroy/${post._id}">delete</a>
            </small>
        
        ${ post.content}
        <small>:
            ${post.user.name}
        </small>
        <div class="post-comment">
            
                <form action="/comments/create" method="POST">
                    <input type="text" name="content" placeholder="type here..." id="" required> 
                    <input type="hidden" name="post" value='${post._id}' >
                    <input type="submit" value="Add Comment">
    
                </form>
            
            <div class="post-comment-list">
                <ul class="post-comment-${post._id}">
    
                </ul>
            </div>
        </div>
    </li>
        `);
  };





    //method to delete a post form DOM
    let deletePost=function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type:'get',
                url:$(deleteLink).prop('href'),
                success:function(data){
                    $(`#post-${data.data.post_id}`).remove()
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },
                error:function(error){
                    console.log(error.responseText);
                }
            })
        })
    }


  // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
  let convertPostsToAjax = function(){
    $('#posts-list-container>ul>li').each(function(){
        let self = $(this);
        let deleteButton = $(' .delete-post-button', self);
        deletePost(deleteButton);

        // get the post's id by splitting the id attribute
        let postId = self.prop('id').split("-")[1]
        new PostComments(postId);
    });
}
createPost();
convertPostsToAjax();

}
