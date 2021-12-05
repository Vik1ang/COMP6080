Testing:

1. Component Testing:
    (1) Check if all the element displays correctly
    (2) Check if there are correct number of elements
    (3) Check if the elements bahave correctly (e.g. link navigation, display modal/dialog etc.)
    (4) Check if the state will change or not if clicking relevant/inrelevant component
   

2. UI Testing
    (1) The my_test.js testing required is to make sure the basic functions work properly, and added addtional tests including:
        - create a listing with image thumbnail to test if creating the thumbnail works
        - update the listing with a video link to test if updating the thumbnail and upload a video as thumbnail works
        - view the bookings of the listing to test if we are able to check the bookings for the listing after the user makes a booking
        - delete this listing to test if deletion succeeds
    (2) my_test_2: Check if the input field can handle wrong input (testing edge cases since it is too hard for me to test invalid inputs for complicated MUI component in component testing)
        - negative number of bedrooms
        - negative number of bathrooms
    (3) my_test_3: Unhappy path testing weird user bahaviour (error message will pop up):
        - login in with an invalid email
        - sign up successfully 
        - sign up with the same email address / name : some users may be registering twice with the same emails 
        - sign up with an empty name

