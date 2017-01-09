var $content = $('#content'); 
// var $json = $('#json'); 

// Environment Variables
var slice = "control";
var env = "rmntest.com";
var security = "https://";

// Main object that will hold entire set of links
var contentObject = {sections:{}};

// Add sections from JSON
addSectionsJSON([
	homePage,
	homePageLinks,
	footerLinks,
	CostCoPages,
	communityPages,
	communityPagesIe,
	searchPages,
	storePages,
	testEnvPages,
	ideaPages,
	dealsPages,
	categoryPages,
	giftcardPages,
	miscPages,
	studentAffinityPagesTest,
	colorAffinityPagesTest,
	deprecatedPages]);

// Function to add JSON sections to contentObject
function addSectionsJSON(sections){
	for (section of sections){
		addSectionJSON(section);
	}
}

// Function to add JSON section to contentObject
function addSectionJSON(section){
	contentObject.sections[section.sectionName] = section;
	delete contentObject.sections[section.sectionName].sectionName;
}

// Creates HTML for a Header Section
function makeHeader(contentSection, slice){
	return "<h2>" + contentSection + " (slice: " + slice + ")" + "</h2>";
}

// Creates HTML link with ?refresh and &slice from a URL
// If nobr is false or absent, a <br> is added after link
// If nobr is true, no <br> is added after link
function makeAnchor(url,label){
	// If no label is provided, use URL as label
	var label = label || url;

	// Combine abel and url into an achor tag
	var url = "<a target=\"_blank\" href=\"" +
			url + "?refresh=1" +
			"&slice=" + slice + "\">" +
			label +
			"</a> ";

			return url;
}

// function makeAnchor(sect){
// 	var url = security + sect.pre + env + sect.sub + sect.endPoints[endPoint];
// 	$content.append(makeLink(url));
// };

function update(){
	$content.empty(); // Clear Existing Links

	// Get latest settings on form buttons and fields
	slice = $('#slice').val() || slice; // Get slice from text field
	env = $('input[name="environment"]:checked').val(); // Assign evn via radio button
	security = $('input[name="http"]:checked').val(); // Assign security via radio button

	// Taverse Pages.sections object, putting url arrays into pageSection
	for (section in contentObject.sections){

		// Check the Scope of the section
		// Skips if it doesn't match
		// no scope = always render
		var scope = contentObject.sections[section].scope;
		if (scope) {
			if (!env.includes(scope)) continue;
		} 

		// Add a header to the page based on section name
		$content.append(makeHeader(section,slice));

		// endpoint = index of content.sections[contentSection].endPoints
		var ends = contentObject.sections[section].endPoints;
		for (var endPoint in ends){

			// Cache these values for use in inner loops
			var sect = contentObject.sections[section];
			var url = security + sect.pre + env + sect.sub + sect.endPoints[endPoint];

			// If the section is not a storepage, it just adds the link
			if (contentObject.sections[section].sub !== "view/"){
				$content.append(makeAnchor(url));
				$content.append("<br>");

			// Special Case for 'view/' pages (add landing pages)
			} else {

				// Adds the first link with url
				$content.append(makeAnchor(url));

				// adds remaining links of landing, landing2.... with a short label
				for (sub of landingPages){
					sect.sub = sub;
					url = security + sect.pre + env + sect.sub + sect.endPoints[endPoint];
					console.log("url",url);
					console.log("sect",sect);
					$content.append("- "+makeAnchor(url,sub,true));
				}

				// End of landing case
				$content.append("<br>"); // since nobr was true
				sect.sub = "view/"; // change back for next loop
			}
		};
	}
};

// Run update() for the first time to initialize page
update();

// Run update() after any change in form
$('form').on('change', update);

// Prevent enter from submitting form, run update() instead
$('form').on('keyup keypress', function(e) {
  var keyCode = e.keyCode || e.which;
  if (keyCode === 13) { 
    e.preventDefault();
    update();
    return false;
  }
});

//debugging

function updateJSON(){
		console.log(JSON.stringify(contentObject, 1, '  '));
};

updateJSON();
