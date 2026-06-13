import { ClassicEditor, Essentials, Paragraph, Bold, Italic, Image, ImageUpload } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

class MyUploadAdapter {
    constructor( loader ) {
        this.loader = loader;
    }

    upload() {
        return this.loader.file.then( file => new Promise( ( resolve, reject ) => {
            const data = new FormData();
            data.append( 'upload', file );

            fetch( '/upload-image', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute('content')
                },
                body: data
            } )
            .then( res => res.json() )
            .then( json => {
                if ( json.error ) {
                    return reject( json.error.message );
                }
                resolve( { default: json.url } );
            } )
            .catch( reject );
        } ) );
    }

    abort() {
        // сюда можно повесить отмену запроса, если нужно
    }
}

function MyUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = loader => {
        return new MyUploadAdapter( loader );
    };
}

const el = document.querySelector( '#editor' );

if ( el ) {
    ClassicEditor
        .create( {
            attachTo: el,
            licenseKey: 'GPL',
            plugins: [ Essentials, Paragraph, Bold, Italic, Image, ImageUpload ],
            extraPlugins: [ MyUploadAdapterPlugin ],
            toolbar: [ 'bold', 'italic', '|', 'uploadImage' ]
        } )
        .then( editor => console.log( 'Editor ready', editor ) )
        .catch( err => console.error( err ) );
}
