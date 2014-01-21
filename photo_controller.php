<?php
require_once("Classes/FTP.Class.php");
	$arquivo = $_FILES['Foto'];
	$tempFile = $_FILES['Foto']['tmp_name'];
	$targetPath = "/public_html/imagens/uploaded/"; // FTP path
	$typesArray = array("jpeg","jpg","gif","bmp","png");
	$fileParts  = pathinfo($_FILES['Foto']['name']);

	if (in_array($fileParts['extension'],$typesArray))
	{
		//Tamanho máximo do arquivo (em bytes) - Deve estar de acordo com a coniguração do seu Apache.
		$config["tamanho"] = 1048576; // 1 MB
		// Verifica tamanho do arquivo
		if($arquivo["size"] >= $config["tamanho"])
		{
			echo '{"success": false, "msg":"A imagem deve ser de no m&aacute;ximo '.($config["tamanho"]/1024).' KBytes."}';
			exit;
		}
		// Configure aqui como quer o nome do arquivo final. Use meios de não ter 2 imagens com nomes iguais
		$nome = "image_".time().".".$fileParts['extension']; 
		$target_local_file =   "imagens/uploaded/".$nome; // Seu diretorio onde as fotos ficarão gravadas e serão acessadas.
		$targetFile = str_replace('//','/',$targetPath).$nome;
		$ftp = new FTP($target_local_file);
		$ftp->Upload($targetFile, $tempFile, FTP_BINARY);
	}
	 else
	{
		echo '{"success": false, "msg":"A imagem deve ser das seguintes extens&otilde;es: '.(implode(",", $typesArray)).'"}';
		exit;
	}
?>
