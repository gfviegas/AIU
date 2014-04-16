<?php
require_once("Classes/FTP.Class.php");
	$file = $_FILES['Photo'];
	$tempFile = $_FILES['Photo']['tmp_name'];
	$targetPath = "public_html/images/uploaded/"; // FTP path
	$typesArray = array("jpeg","jpg","gif","bmp","png");
	$fileParts  = pathinfo($_FILES['Photo']['name']);

	if (in_array($fileParts['extension'],$typesArray))
	{
		//The file max size (in bytes) - It must be <= the apache max size.
		$config["size"] = 1048576; // 1 MB
		// Checks the image size.
		if($file["size"] >= $config["size"])
		{
			echo '{"success": false, "msg":"The image max size is '.($config["tamanho"]/1024).' KBytes."}';
			exit;
		}
		// Set here how you want the final-file name. Use ways to avoid name conflicts.
		$name = "image_".time().".".$fileParts['extension'];
		$targetFile = str_replace('//','/',$targetPath).$name;
		$ftp = new FTP($targetFile);
		$ftp->Upload($targetFile, $tempFile, FTP_BINARY);
	}
	 else
	{
		echo '{"success": false, "msg":"The image needs to be the following extensions: '.(implode(",", $typesArray)).'"}';
		exit;
	}
?>
