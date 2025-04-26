import FormControls from "@/components/common-form/form-controls"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { courseLandingPageFormControls, teacherLandingPageFormControls } from "@/config"
import { InstructorContext } from "@/context/instructor-context"
import { useContext } from "react"

const CourseLanding = () => {

    const { courseLandingFormData, setCourseLandingFormData } = useContext(InstructorContext);


    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Course Landing Page</CardTitle>
                </CardHeader>
                <CardContent>
                    <FormControls
                        formControls={courseLandingPageFormControls}
                        formData={courseLandingFormData}
                        setFormData={setCourseLandingFormData}
                    />
                </CardContent>
            </Card>



            <Card>
                <CardHeader>
                    <CardTitle>Instructor Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <FormControls
                        formControls={teacherLandingPageFormControls}
                        formData={courseLandingFormData}
                        setFormData={setCourseLandingFormData}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default CourseLanding
