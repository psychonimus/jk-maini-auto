
document.getElementById('ApplyNow').addEventListener('submit', function (e) {
    debugger
        e.preventDefault();
       

        const form = document.getElementById('ApplyNow');
        const messageDiv = document.getElementById('message');
        const errorDiv = document.getElementById('error');

       
        if (!form || !messageDiv || !errorDiv) {
            console.error('Form or message/error div not found');
            errorDiv.textContent = 'Form or message/error div not found.';
            return;
        }

      
        const fullNameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const educationInput = document.getElementById('education');
        const coverLetterInput = document.getElementById('coverLetter');
        const resumeInput = document.getElementById('resume');
        const forPositionInput = document.querySelector('.job-header h2');
        const jobTitle = forPositionInput ? forPositionInput.textContent : 'Unknown Job Title';

        if (!fullNameInput || !emailInput || !phoneInput || !educationInput ||
            !coverLetterInput || !resumeInput) {
            errorDiv.textContent = 'One or more form fields are missing.';
            console.error('Missing form fields');
            return;
        }

       

        const fullName = fullNameInput.value || '';
        const email = emailInput.value || '';
        const phone = phoneInput.value || '';
        const education = educationInput.value || '';
        const coverLetter = coverLetterInput.value || '';
        const resume = resumeInput.files[0];
        const forPosition = jobTitle || '';
        messageDiv.textContent = '';
        errorDiv.textContent = '';

       
        if (!fullName || !email || !resume) {
            errorDiv.textContent = 'Please fill all required fields (Full Name, Email, Resume).';
            console.error('Required fields missing:', { fullName, email, resume });
            return;
        }

      
        if (resume) {
            console.log('Resume file:', resume.name, resume.size, resume.type);
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            const allowedExtensions = ['.pdf', '.doc', '.docx'];
            const fileExtension = resume.name.substring(resume.name.lastIndexOf('.')).toLowerCase();
            if (!allowedTypes.includes(resume.type) || !allowedExtensions.includes(fileExtension)) {
                errorDiv.textContent = 'Invalid file type. Please upload a PDF, DOC, or DOCX file.';
                console.error('Invalid file type:', resume.type, fileExtension);
                return;
            }
        } else {
            errorDiv.textContent = 'Please upload a resume file.';
            console.error('No resume file selected');
            return;
        }
        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('phoneno', phone);
        formData.append('education', education);
        formData.append('forPosition', forPosition);
        formData.append('resume', resume);
        formData.append('coverLetter', coverLetter);
        //formData.append('subject', 'Resume Submission');
        //formData.append('htmlContent', `<p>Hello ${fullName},</p><p>Thank you for submitting your resume.</p><p>Your education: ${education}</p><p>Your cover letter: ${coverLetter}</p><p>Contact: ${phone}, ${email}</p>`);

    //   const url = 'http://115.124.123.180:8097/api/mail';
     const url = 'https://api.jkmaini.com/api/mail';
        
        fetch(url, {
            method: 'POST',
            body: formData
        })


            .then(response => {
               
                return Promise.all(['Application submitted successfully.']);
            })
            .then((text, ok, status) => {
                debugger
                let data = {};
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    data = { error: text || 'Invalid response from server', rawText: text };
                }
                
                // Check for success indicators even if status is not 200-299
                const isSuccess = ok || 
                    (data && (
                        (typeof data.message === 'string' && data.message.toLowerCase().includes('success')) ||
                        (typeof data.status === 'string' && data.status.toLowerCase().includes('success')) ||
                        (typeof data.rawText === 'string' && (
                            data.rawText.toLowerCase().includes('success') ||
                            data.rawText.toLowerCase().includes('sent')
                        ))
                    ));
                if (isSuccess) {
                    messageDiv.textContent = data.message || data.rawText || 'Application submitted successfully.';
                } else {
                    errorDiv.textContent = data.error || data.message || data.rawText || `Failed to send resume (Status: ${status || 'unknown'}).`;
                    console.error('API error:', data);
                }
                return { data, ok, status };
            })

            .catch(error => {
                console.error('Fetch error:', error);
                errorDiv.textContent = `Error: ${error.message}`;
            })
            .finally(() => {
                form.reset();
                
            });
    });

