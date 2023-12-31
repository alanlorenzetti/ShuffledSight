function deidentifyFiles() {
    return new Promise((resolve, reject) => {
        let filesInput = document.getElementById('files');
        let files = Array.from(filesInput.files); // Convert FileList to Array.

        files = shuffle(files); // Shuffle the files.

        let log = "original_name\tdeidentified_name\n"; // Initialize the log with headers.
        let deidentifiedFiles = [];

        for (let i = 0; i < files.length; i++) {
            let file = files[i];

            // Get the file extension.
            let extension = file.name.split('.').pop();

            // Create a new file with the deidentified name and the same content.
            let deidentifiedFile = new File([file], "file" + (i + 1) + "." + extension, {type: file.type});
            deidentifiedFiles.push(deidentifiedFile);

            // Add a log entry for this file.
            log += file.name + "\t" + deidentifiedFile.name + "\n";
        }

        // Generate a downloadable link for the deidentified files and the log.
        let zip = new JSZip();
        deidentifiedFiles.forEach((file, index) => {
            zip.file(file.name, file);
        });
        zip.file("dictionary.tsv", log);
        zip.generateAsync({type: "blob"})
        .then(function(content) {
            let downloadLink = document.getElementById('downloadLink');
            let url = window.URL.createObjectURL(content);
            downloadLink.href = url;
            downloadLink.download = "deidentifiedFiles.zip";
            downloadLink.style.display = 'block'; // Make the link visible.
            resolve(); // resolve the promise
        })
        .catch(function(error){
            reject(error); // reject the promise if there's an error
        });
    });
}

// Shuffle function (Fisher-Yates algorithm)
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Show selected file names
function showFileNames() {
    let filesInput = document.getElementById('files');
    let fileListDiv = document.getElementById('fileList');
    let showFilesButton = document.getElementById('showFilesButton');
    let deidentifyButton = document.getElementById('deidentifyButton');
    let files = filesInput.files;
    let fileNames = "";

    for (let i = 0; i < files.length; i++) {
        fileNames += files[i].name + "<br>";
    }

    fileListDiv.innerHTML = fileNames;
    showFilesButton.style.display = 'block'; // Make the button visible.

    if (files.length > 0) {
        deidentifyButton.disabled = false; // Enable the Deidentify button if files are selected.
    } else {
        deidentifyButton.disabled = true; // Keep the Deidentify button disabled if no files are selected.
    }
}

// Toggle display of the file list
function toggleFileList() {
    let fileListDiv = document.getElementById('fileList');

    if (fileListDiv.style.display === 'none') {
        fileListDiv.style.display = 'block';
    } else {
        fileListDiv.style.display = 'none';
    }
}

// Handling the button state to show
// the .please wait. message
function startDeidentification() {
    let deidentifyButton = document.getElementById("deidentifyButton");
    deidentifyButton.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Processing... Please, wait.';
    deidentifyButton.disabled = true;

    deidentifyFiles().then(() => {
        deidentifyButton.innerHTML = '<i class="fa fa-check"></i> Done!';
    }).catch((error) => {
        console.error("Deidentification failed:", error);
        deidentifyButton.innerHTML = '<i class="fa fa-random"></i> Deidentify';
        deidentifyButton.disabled = false;
    });
}

// Help
function toggleHelp() {
    let helpSection = document.getElementById('helpSection');

    if (helpSection.style.display === 'none') {
        helpSection.style.display = 'block';
    } else {
        helpSection.style.display = 'none';
    }
}