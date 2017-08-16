<?php
       // from the form
       $name = trim(strip_tags($_POST['fname']));
       $email = trim(strip_tags($_POST['femail']));
       $message = htmlentities($_POST['subject']);

       // set here
       $subject = "Contact form submitted!";
       $to = 'shelton.ali1@gmail.com';

       $body = <<<HTML
$message
HTML;

       $headers = "From: $email\r\n";
       $headers .= "Content-type: text/html\r\n";

       // send the email
       mail($to, $subject, $body, $headers);
       header('Location: index.html');
?>