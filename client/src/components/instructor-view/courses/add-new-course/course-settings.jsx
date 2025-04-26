import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/services";
import { useContext } from "react";

const CourseSettings = () => {

    const { courseLandingFormData, setCourseLandingFormData,
        mediaUploadProgress, setMediaUploadProgress,
        mediaUploadProgressPercentage, setMediaUploadProgressPercentage, }
        = useContext(InstructorContext);


    async function handleImageUploadChange(event) {
        const selectedImage = event.target.files[0];

        if (selectedImage) {
            const imageFormData = new FormData();
            imageFormData.append('file', selectedImage)

            try {
                setMediaUploadProgress(true)
                const response = await mediaUploadService(imageFormData, setMediaUploadProgressPercentage)
                console.log(response, "response")
                if (response.success) {
                    setCourseLandingFormData({
                        ...courseLandingFormData,
                        image: response.data.url
                    })

                    setMediaUploadProgress(false);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }








    async function handleTImageUploadChange(event) {
        const selectedImage = event.target.files[0];

        if (selectedImage) {
            const imageFormData = new FormData();
            imageFormData.append('file', selectedImage)

            try {
                setMediaUploadProgress(true)
                const response = await mediaUploadService(imageFormData, setMediaUploadProgressPercentage)
                console.log(response, "response")
                if (response.success) {
                    setCourseLandingFormData({
                        ...courseLandingFormData,
                        teacherImage: response.data.url
                    })

                    setMediaUploadProgress(false);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }




    //replace image:
    async function handleReplaceImage() {
        let cpyLandingCourseFormData = [courseLandingFormData]
        console.log(cpyLandingCourseFormData)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Course Settings</CardTitle>
            </CardHeader>
            <div className="p-4">
                {
                    mediaUploadProgress ? (
                        <MediaProgressbar
                            isMediaUploading={mediaUploadProgress}
                            progress={mediaUploadProgressPercentage}
                        />) : null
                }
            </div>

            <CardContent>
                {

                    courseLandingFormData?.image ?
                        <div>
                            <img src={courseLandingFormData.image} />
                            <Button onClick={handleReplaceImage}>Replace Image</Button>
                        </div>
                        :

                        <div className="flex flex-col gap-3">
                            <Label>Upload Course Image</Label>
                            <Input
                                onChange={handleImageUploadChange}
                                type="file"
                                accept="image/*"

                            />
                        </div>
                }



            </CardContent>






            <CardHeader>
                <CardTitle>Teacher Settings</CardTitle>
            </CardHeader>
            <div className="p-4">
                {
                    mediaUploadProgress ? (
                        <MediaProgressbar
                            isMediaUploading={mediaUploadProgress}
                            progress={mediaUploadProgressPercentage}
                        />) : null
                }
            </div>

            <CardContent>
                {

                    courseLandingFormData?.teacherImage ?
                        <div>
                            <img height={250} width={400} src={courseLandingFormData.teacherImage} />
                            <Button onClick={handleReplaceImage}>Replace Image</Button>
                        </div>
                        :

                        <div className="flex flex-col gap-3">
                            <Label>Upload Teacher Image</Label>
                            <Input
                                onChange={handleTImageUploadChange}
                                type="file"
                                accept="image/*"

                            />
                        </div>
                }

            </CardContent>




        </Card>












    )
}

export default CourseSettings

