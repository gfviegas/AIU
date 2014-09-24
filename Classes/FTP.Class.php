<?php
 Class FTP {
	private $host = ""; // Your FTP data
	private $user = "";
	private $password = "";
	public $connection;

	function __construct($target)
	{
		$this->connection = ftp_connect($this->host);
		$this->tar_lo_fi = $target;
	}

	private function Login()
	{
		$login = ftp_login($this->connection, $this->user, $this->password);
		ftp_pasv ($this->connection, true);
		if (!$login)
		{
			echo '{"sucess": false, "msg":"Server authentication error"}';
			exit;
		}
	}


	public function Upload($path, $file, $method)
	{
		$this->Login();
		$put = ftp_put($this->connection, $path, $file, $method);
		if (!$put)
		{
			echo '{"success": false, "msg":"Server error"}';
			exit;
		}
		else
		{
			echo '{"success": true, "src": "'.$this->tar_lo_fi.'"}';
		}
		$this->Quit();
		exit;
	}

	private function Quit(){
		ftp_close($this->connection);
	}
}
?>