var editFlag = false;

$(document).ready(function() {
    $('#dishForm').on('submit', function(e) {
        e.preventDefault();
        const dishId = $('#dishId').val();
        console.log(editFlag);
        const url = editFlag == true ? `http://localhost:3000/dish/update/${dishId}` : 'http://localhost:3000/dish/create';
        const method = editFlag == true ? 'PUT' : 'POST'; // Consider using POST for both if not configured for PUT on the server.
        $.ajax({
            url: url,
            method: method,
            contentType: 'application/json',
            data: JSON.stringify({
                dishId: $('#dishId').val(),
                MenuID: $('#menuId').val(),
                MainIngredient: $('#mainIngredient').val(),
                Allergen: $('#allergen').val(),
                DishName: $('#dishName').val(),
                Description: $('#description').val()
            }),
            success: function(response) {
                console.log('Success:', response);
                editFlag = false;
                $('#dishForm')[0].reset();
                $('#newDishBtn').prop('disabled', false);
                toggleSubmitButton('dish', false);
                 
                readDishes();
            },
            error: function(error) {
                console.error('Error:', error);
            }
        });
    });

    $('#userForm').on('submit', function (e) {
                e.preventDefault();
                const userId = $('#userId').val();
                const url = editFlag == true ? `http://localhost:3000/user/update/${userId}` : 'http://localhost:3000/user/create';
                const method = editFlag == true ? 'PUT' :'POST';
                $.ajax({
                    url: url,
                    method: method,
                    contentType: 'application/json',
                    data: JSON.stringify({
                        UserID: $('#userId').val(), // Ensure this is included only for creation, if needed
                        UserName: $('#userName').val(),
                        Email: $('#email').val(),
                        Phone: $('#phone').val(),
                        Address: $('#address').val()
                    }),
                    success: function (response) {
                        console.log('Success:', response);
                        editFlag = false;
                        $('#userForm')[0].reset(); // Reset form
                        $('#newUserBtn').prop('disabled', false);
                        toggleSubmitButton('user', false);
                        readUsers(); // Reload users
                    },
                    error: function (error) {
                        console.error('Error:', error);
                    }
                });
            });
});

function setupNewDish() {
    $('#dishForm')[0].reset();
    toggleSubmitButton('dish', true); // Enable the submit button
    $('#newDishBtn').prop('disabled', false); // Ensure the new dish button is enabled
}

function editDish(dishId) {
    $('#newDishBtn').prop('disabled', true); 
    toggleSubmitButton('dish', true);
    editFlag = true;
    $.ajax({
        url: `http://localhost:3000/dish/get/${dishId}`,
        method: 'GET',
        success: function(dish) {
            $('#dishId').val(dish.dishId);
            $('#menuId').val(dish.MenuID);
            $('#mainIngredient').val(dish.MainIngredient);
            $('#allergen').val(dish.Allergen);
            $('#dishName').val(dish.DishName);
            $('#description').val(dish.Description);
            toggleSubmitButton('dish', true); // Enable the submit button
            $('#newDishBtn').prop('disabled', true); // Disable the new dish button
        },
        error: function(error) {
            console.error('Error fetching dish:', error);
        }
    });
}

function deleteDish(dishId) {
    $.ajax({
        url: `http://localhost:3000/dish/delete/${dishId}`,
        method: 'DELETE',
        success: function(dish) {
            readDishes();
        },
        error: function(error) {
            console.error('Error deleting dish:', error);
        }
    });
}

function deleteUser(userId) {
    $.ajax({
        url: `http://localhost:3000/user/delete/${userId}`,
        method: 'DELETE',
        success: function(user) {
            readUsers();
        },
        error: function(error) {
            console.error('Error deleting user:', error);
        }
    });
}



function setupNewUser() {
    $('#userForm')[0].reset();
    toggleSubmitButton('user', true); // Enable the submit button
    $('#newUserBtn').prop('disabled', false); // Ensure the new user button is enabled
}

function editUser(userId) {
    $('#newUserBtn').prop('disabled', true);
    toggleSubmitButton('user', true);
    editFlag = true;
    $.ajax({
        url: `http://localhost:3000/user/get/${userId}`,
        method: 'GET',
        success: function(user) {
            $('#userId').val(user.UserID);
            $('#userName').val(user.UserName);
            $('#email').val(user.Email);
            $('#phone').val(user.Phone);
            $('#address').val(user.Address);
            toggleSubmitButton('user', true); // Enable the submit button
            $('#newUserBtn').prop('disabled', true); // Disable the new user button
        },
        error: function(error) {
            console.error('Error fetching user:', error);
        }
    });
}

function toggleSubmitButton(type, enable) {
    const btnId = type === 'dish' ? '#submitDishBtn' : '#submitUserBtn';
    $(btnId).prop('disabled', !enable);
}


function readDishes() {
    $.ajax({
        url: 'http://localhost:3000/dish/read',
        method: 'GET',
        success: function (dishes) {
            let html = dishes.map(dish =>
                `<tr>
                    <td>${dish.dishId}</td>
                    <td>${dish.MenuID}</td>
                    <td>${dish.MainIngredient}</td>
                    <td>${dish.Allergen}</td>
                    <td>${dish.DishName}</td>
                    <td>${dish.Description}</td>
                    <td>
                        <button onclick="deleteDish(${dish.dishId})" class="btn btn-danger">Delete</button>
                        <button onclick="editDish(${dish.dishId})" class="btn btn-warning">Edit</button>
                    </td>
                </tr>`).join('');
            $('#dishes').html(html);
        },
        error: function (error) {
            console.error('Error loading dishes:', error);
        }
    });
}

function readUsers() {
    $.ajax({
        url: 'http://localhost:3000/user/read',
        method: 'GET',
        success: function (users) {
            let html = users.map(user =>
                `<tr>
                    <td>${user.UserID}</td>
                    <td>${user.UserName}</td>
                    <td>${user.Email}</td>
                    <td>${user.Phone || 'N/A'}</td>
                    <td>${user.Address}</td>
                    <td>
                        <button onclick="deleteUser(${user.UserID})" class="btn btn-danger">Delete</button>
                        <button onclick="editUser(${user.UserID})" class="btn btn-warning">Edit</button>
                    </td>
                </tr>`).join('');
            $('#users').html(html);
        },
        error: function (error) {
            console.error('Error loading users:', error);
        }
    });
}