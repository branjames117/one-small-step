

function addListItem (name, craftId){
    const astronames = document.querySelector('name')
    const astroInIss = objectFromApi.people.filter(person =>{ person.craft==='ISS'})
    li.appendChild(document.createElement(names))
    ul.appendChild(li)
    }
    function afterload(){
        var data = JSON.parse(this.responseText);
        var name = document.createElement('astroName');
    
        const results = data.results;
    
        //loop through items
        results.array.forEach(item => {
            addListItem(item.name, "names"); 
        });
    }
    