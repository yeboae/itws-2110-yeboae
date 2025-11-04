<?php 

abstract class Operation {
  protected $operand_1;
  protected $operand_2;
  public function __construct($o1, $o2) {
    // Check if both inputs are actually numbers
    if (!is_numeric($o1) || !is_numeric($o2)) {
      throw new Exception('Non-numeric operand.');
    }
    
    // Save the numbers to use later
    $this->operand_1 = $o1;
    $this->operand_2 = $o2;
  }
  public abstract function operate();
  public abstract function getEquation(); 
}

// Handles addition
class Addition extends Operation {
  public function operate() {
    return $this->operand_1 + $this->operand_2;
  }
  public function getEquation() {
    return $this->operand_1 . ' + ' . $this->operand_2 . ' = ' . $this->operate();
  }
}


// Part 1 - Add subclasses for Subtraction, Multiplication and Division here
// Handles subtraction
class Subtraction extends Operation {
  public function operate() {
    return $this->operand_1 - $this->operand_2;
  }
  public function getEquation() {
    return $this->operand_1 . ' - ' . $this->operand_2 . ' = ' . $this->operate();
  }
}

// Handles multiplication
class Multiplication extends Operation {
  public function operate() {
    return $this->operand_1 * $this->operand_2;
  }
  public function getEquation() {
    return $this->operand_1 . ' * ' . $this->operand_2 . ' = ' . $this->operate();
  }
}

// Handles division
class Division extends Operation {
  public function operate() {
    if ($this->operand_2 == 0) {
      throw new Exception('Cannot divide by zero.');
    }
    return $this->operand_1 / $this->operand_2;
  }
  public function getEquation() {
    // Check if we're trying to divide by zero
    try {
      $result = $this->operate();
      return $this->operand_1 . ' / ' . $this->operand_2 . ' = ' . $result;
    } catch (Exception $e) {
      // Show error message if dividing by zero
      return $this->operand_1 . ' / ' . $this->operand_2 . ' = [ERROR: Division by zero]';
    }
  }
}


// End Part 1

/* 
QUESTIONS ANSWERED:

1) CLASSES AND FLOW EXPLANATION:
- Operation is the main class that sets up the two numbers and makes sure they're valid
- Each math type (add, subtract, etc.) has its own class that does the actual calculation
- When you click a button, the form sends the numbers and which button was pressed
- The code checks which button was clicked and creates the right math object
- Then it calls getEquation() to show the full math problem and answer
- Any errors get caught and shown at the top

2) USING $_GET INSTEAD:
- With GET, the form data would show up in the URL like ?op1=5&op2=3&add=Add
- This is less secure because people can see the data in browser history and URLs
- GET has size limits, POST can handle more data
- GET is better for bookmarking, POST is better for forms that change things
- For a calculator, POST is better because it keeps the numbers private

3) BETTER WAY TO HANDLE BUTTONS:
- Instead of checking each button separately, we could use one submit button
- Add a hidden field or dropdown to select the operation type
- Then we'd just check one value instead of four different if statements
- This would be cleaner and easier to add new operations later
*/




// Some debugging stuff - uncomment if you need to see what's happening
// echo '$_POST print_r=>',print_r($_POST);
// echo "<br>",'$_POST vardump=>',var_dump($_POST);
// echo '<br/>$_POST is ', (isset($_POST) ? 'set' : 'NOT set'), "<br/>";
// echo "<br/>---";




// Check if the form was submitted
// When the page first loads, it uses GET method so $_POST will be empty

  if($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get the numbers from the form, use 0 if they're not set
    $o1 = isset($_POST['op1']) ? $_POST['op1'] : 0;
    $o2 = isset($_POST['op2']) ? $_POST['op2'] : 0;
  }
  $err = Array();


// Part 2 - Create the right math operation object based on which button was clicked
// 
// The addition part is already done. You need to do the other three operations.
// Then see if there's a cleaner way to do this instead of all these if statements

  try {
    if (isset($_POST['add']) && $_POST['add'] == 'Add') {
      $op = new Addition($o1, $o2);
    }
// Put the code for Part 2 here  \/
    else if (isset($_POST['sub']) && $_POST['sub'] == 'Subtract') {
      $op = new Subtraction($o1, $o2);
    }
    else if (isset($_POST['mult']) && $_POST['mult'] == 'Multiply') {
      $op = new Multiplication($o1, $o2);
    }
    else if (isset($_POST['div']) && $_POST['div'] == 'Divide') {
      $op = new Division($o1, $o2);
    }
// End of Part 2   /\

  }
  catch (Exception $e) {
    $err[] = $e->getMessage();
  }
?>

<!doctype html>
<html>
<head>
<title>Lab 6</title>
</head>
<body>
  <pre id="result">
  <?php 
    if (isset($op)) {
      try {
        echo $op->getEquation();
      }
      catch (Exception $e) { 
        $err[] = $e->getMessage();
      }
    }
      
    foreach($err as $error) {
      echo $error . "\n";
    } 
  ?>
  </pre>
  <form method="post" action="lab6.php"> 
    <input type="text" name="op1" id="name" value="" />
    <input type="text" name="op2" id="name" value="" />
    <br/>
    <input type="submit" name="add" value="Add" />  
    <input type="submit" name="sub" value="Subtract" />  
    <input type="submit" name="mult" value="Multiply" />  
    <input type="submit" name="div" value="Divide" />  
  </form>
</body>
</html>