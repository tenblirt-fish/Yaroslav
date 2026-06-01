$listener = New-Object System.Net.HttpListener;
$listener.Prefixes.Add("http://127.0.0.1:8080/");
$listener.Start();
Write-Host "PowerShell HTTP Server listening on port 8080...";
while ($listener.IsListening) {
    try {
        $context = $listener.GetContext();
        $request = $context.Request;
        $response = $context.Response;
        $urlPath = $request.Url.LocalPath;
        if ($urlPath -eq "/") { $urlPath = "/index.html" }
        $localFile = "c:\Users\user\Documents\Yar HP" + $urlPath.Replace("/", "\");
        if (Test-Path $localFile -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($localFile);
            $ext = [System.IO.Path]::GetExtension($localFile).ToLower();
            $mime = "text/html";
            if ($ext -eq ".css") { $mime = "text/css" }
            elseif ($ext -eq ".js") { $mime = "application/javascript" }
            elseif ($ext -eq ".png") { $mime = "image/png" }
            elseif ($ext -eq ".jpg" -or $ext -eq ".jpeg") { $mime = "image/jpeg" }
            elseif ($ext -eq ".mp4") { $mime = "video/mp4" }
            $response.ContentType = $mime;
            $response.ContentLength64 = $content.Length;
            $response.OutputStream.Write($content, 0, $content.Length);
        } else {
            $response.StatusCode = 404;
        }
        $response.Close();
    } catch {
        Write-Host "Server error, maintaining loop..."
    }
}
