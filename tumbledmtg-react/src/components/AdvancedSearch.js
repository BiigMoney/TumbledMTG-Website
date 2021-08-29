const AdvancedSearch = () => {
  return (
    <div className="container">
      <h1>Search Guide: </h1>
      <h4>Any word without a colon will be searched for in the title of the card.</h4>
      <h4>You can type is:new to see the cards that have been recently added or modified</h4>
      <h4>c:(colors) to search for colors</h4>
      <h4>c:=(colors) to search for exact colors</h4>
      <h4>c:+(colors) to search for those colors at most</h4>
      <h4>o:(word) for oracle text</h4>
      <h4>o:(word1,word2) to search for multiple words in oracle text</h4>
      <h4>o:("word1,word2") to search for multiple words in order in oracle text</h4>
      <h4>t:(type) for type</h4>
      <h4>cmc:(sign)(value) for cmc</h4>
      <h4>power:(sign)(value) for power</h4>
      <h4>toughness:(sign)(value) for toughness</h4>
      <h4>is:(tag) to search for cards with tag</h4>
      <h4>tags include: changed, added, new, wipe, tron, sacoutlet, ramp, utility</h4>
      <h4>You can also use - before c, o, and t to search for opposite</h4>
    </div>
  )
}

export default AdvancedSearch
