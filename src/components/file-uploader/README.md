# File Uploader
Lit component for uploading files with drag and drop capability. This component does not perform the actual uploading work, it simply provides visual cues and exposes an event when files have been uploaded.


## Usage

```html
<head>
  <script type="module" src="@brightspace-ui/labs/components/file-uploader.js"></script>
</head>
```

### Basic Usage with Accessible Label

It's important to always provide an accessible label which describes the purpose of the uploader using the `label` attribute. The label will be hidden visually but associated with the upload input for those using assistive technologies such as a screen reader.

```html
<d2l-labs-file-uploader label="profile picture"></d2l-labs-file-uploader>
```

### Multi-file Uploads

To allow for multiple files to be uploaded, add the `multiple` attribute:

```html
<d2l-labs-file-uploader multiple ...></d2l-labs-file-uploader>
```

### Localization

The file uploader will automatically render using the language found on the HTML element -- i.e. `<html lang="fr">`. If the language attribute is not present or isn't supported, the uploader will render in English.


### Feedback Messages

If you encounter a scenario where you'd like to display feedback about the uploaded file(s) -- like a warning or an error -- use the `feedback` and `feedback-type` attributes.

The `feedback-type` defaults to "warning"(using `--d2l-color-feedback-warning`), but can also be set to "error"(using `--d2l-color-feedback-error`):
```html
<d2l-labs-file-uploader
	feedback="Sorry, we cannot upload files larger than 1GB.">
</d2l-labs-file-uploader>
```

```html
<d2l-labs-file-uploader
	feedback="An error occurred occurred processing the upload."
	feedback-type="error"></d2l-labs-file-uploader>
```

#### Feedback Changed Event

To listen for when feedback changes within the uploader, register for the `feedback-changed` event.

Vanilla JavaScript:

```html
<d2l-labs-file-uploader id="my-uploader" ...></d2l-labs-file-uploader>
<script>
document.getElementById('my-uploader')
	.addEventListener('feedback-changed', function(evt) {
		var feedbackMessage = evt.detail.value;
		console.log(feedbackMessage);
	});
</script>
```

### Handling Uploaded Files

When the user uploads one or more files, a `d2l-file-uploader-files-added` event is fired. To listen for this event, wire up an event listener to the `<d2l-labs-file-uploader>` element. The listener will be passed an event with an array of [File](https://developer.mozilla.org/en-US/docs/Web/API/File) objects from the [File API](https://developer.mozilla.org/en/docs/Web/API/File).

Vanilla JavaScript:

```html
<d2l-labs-file-uploader id="my-uploader" ...></d2l-labs-file-uploader>
<script>
document.getElementById('my-uploader')
	.addEventListener('d2l-file-uploader-files-added', function(evt) {
		var files = evt.detail.files;
		console.log(files);
	});
</script>
```
