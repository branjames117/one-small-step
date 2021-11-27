const astroInSpace = res.data.people;
const indvOnISS = 
astroInSpace.filter((person) => person.craft === 'ISS');


axios.get('http://api.open-notify.org/astros.json')
    .then(res => console.log(
        res.data.people.filter(person => person.craft === 'ISS')));
