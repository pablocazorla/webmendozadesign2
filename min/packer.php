<?php	
	// Url Parameters
	$stringList = '';
	$type = 'js';
	$path = '';

	if(isset($_GET['type']) && !empty($_GET['type'])){
		$type = $_GET["type"];
	}
	if(isset($_GET['path']) && !empty($_GET['path'])){
		$path = $_GET["path"];		
	}
	if(isset($_GET['files']) && !empty($_GET['files'])){
		$stringList = $_GET["files"];		
	}

	// Content type
	$contentType = $type;
	if($type == 'js'){
		$contentType = 'javascript';
	}
	header('Content-Type: text/' . $contentType);

	// Convert $stringList to Array
	$list = explode(",", $stringList);

	// Gzip
	$gzipStart = '<?php if(extension_loaded("zlib")){ob_start("ob_gzhandler");} header("Content-type: text/' . $contentType . '"); ?>';
	$gzipEnd = '<?php if(extension_loaded("zlib")){ob_end_flush();}?>';
	
	// Get files content
	$file = '';
	$someFile = false;
	for($i = 0; $i < count($list); ++$i) {	
		$filetemp = @file_get_contents('../' . $path . '/' . $list[$i] . '.' . $type);
		if($filetemp){
			$file .= $filetemp;
			$someFile = true;
		}		    
	}

	// If there is some file
	if($someFile){
		// Save a gzip content
		$fileGzip = $gzipStart . $file . $gzipEnd;			
		file_put_contents($type . '/min.php', $fileGzip);
		
		// echo content
		echo $file;
	}	
?>