export function validateForm(data) {
    console.log("Validating...");
    console.log(data);

    //store error message
    const errors = [];

    //validate size (small, medium, or large)
    const validSize = ['small', 'medium', 'large'];
    if(!validSize.includes(data.size)) {
        errors.push("Size must be small, medium, or large");
    }

    //validate method (Pickup or delivery)
    const validMethods = ['pickup', 'delivery'];
    if(!validMethods.includes(data.method)) {
        errors.push("Method must be pickup or delivery.");
    }


    //Return result
    console.log(errors);
    return{
        isValid: errors.length === 0,
        errors
    };
}