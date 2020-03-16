UPM.require(["jquery","UpmDialog","DeveloperNewsletterDialogTemplate","DeveloperNewsletterResultDialogTemplate"],function(E,A,F,D){function C(){new A({template:F}).getResult().done(function(G){B(G["newsletter-email"])
})
}function B(G){function H(I){new A({template:D,data:{success:I}})
}if(G&&G.trim()){E.ajax({url:"https://hamlet.atlassian.com/1.0/public/email/"+G+"/subscribe?mailingListId=1243499",type:"post",success:function(){H(true)
},error:function(I){H(false)
}})
}}E(function(){E(".developer-newsletter").click(C)
})
});