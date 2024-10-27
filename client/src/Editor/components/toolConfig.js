
export  const QuillConfiguration=  {
    theme: 'snow',
    modules: {
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{'image': true}],
                [{ 'color': [] }, { 'background': [] }],
                ['clean'],
                ['link'],
                ['blockquote'],
                ['code-block'],
                ['video'],
               
                ['horizontal'],
                
            ]
        }
    }
};