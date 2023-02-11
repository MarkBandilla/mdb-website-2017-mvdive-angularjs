<?
// Process payments via Magpie Checkout

require 'vendor/autoload.php';
ini_set('display_errors', 1);

// Timezone Manila
date_default_timezone_set('Asia/Manila');

$reply = array();
session_start();

$statement_descriptor = 'Magpie/TEST';

// Your Magpie API keys
define('MAGPIE_SECRET_KEY', 'sk_test_KEYHERE');
define('MAGPIE_PUBLIC_KEY', 'pk_test_KEYHERE');

if(!empty($_POST)) {

	// Handle token
	$token = '';
	if (isset($_POST['token'])) {

		$token = $_POST['token'];

		// Check for a duplicate submission, just in case:
		// Uses sessions, you could use a cookie instead.
		if (isset($_SESSION['token']) && ($_SESSION['token'] == $token)) {
			$errors['title'] = 'Form Submission Error';
			$errors['message'] = 'You have apparently resubmitted the form. Please do not do that.';
		} else { // New submission.
			$_SESSION['token'] = $token;
		}

	} else {

        // Token does not exist
		$reply['title'] = 'JavaScript Error';
		$reply['message'] = 'The order cannot be processed. Please make sure you have JavaScript enabled and try again.';

	}

	// Handle amount
	$amount = 0;
	if (isset($_POST['amount'])) {

		$amount = $_POST['amount'];

	} else {

		$reply['title'] = 'Payment Error';
		$reply['message'] = 'There\'s no amount to pay. This order was not processed.';

	}

	// Handle description
    $description = '';

	if (isset($_POST['description'])) {

		$description = $_POST['description'];

	} else {

		$reply['title'] = 'Purchase Error';
        $reply['message'] = 'Item/s not found. This order was not processed.';
	}

	//////////////////////////////////////////////////
	// Seems everything is in order
	//////////////////////////////////////////////////

	if (empty($reply)) {

		// Use Magpie
		$magpie = new MagpieApi\Magpie(MAGPIE_PUBLIC_KEY, MAGPIE_SECRET_KEY);

		// Create the charge and capture
		$response = $magpie->charge->create(
			$amount,		// Amount
			'php',			// Currency
			$token,			// Token
			$description,	// Product description
			$statement_descriptor,	// The statement descriptor
			TRUE 			// Capture (true is capture, false is not)
			);

		// Get the reply from Magpie
		$magpieReply = $response->toArray();

		// Check the response
		if ($response->isSuccess()) {
			// The charge went through
			// To-do:

			// Record the transaction details
			//Send email
			// Other stuff

			// Set reply
			$reply['title'] = "Payment Success";
			$reply['message'] = "Thanks for your payment.";

		} else {
			// The charge failed
			// Get the response
			$reply['title'] = 'Payment Processing Error';
			$reply['message'] = json_encode($magpieReply, JSON_PRETTY_PRINT);
		}

	}

} else {

	// Server error
	$reply['title'] = 'Server Error';
	$reply['message'] = 'You are not allowed to access this.';

}

// Send output
echo json_encode($reply);

?>
