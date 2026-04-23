import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { BehaviorSubject, retry } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SBC {
  baseurl = environment.baseUrl;
  private isExpandedSubject = new BehaviorSubject<boolean>(true);
  isExpanded$ = this.isExpandedSubject.asObservable();

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkLoginStatus());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  checkLoginStatus(): boolean {
    return !!sessionStorage.getItem('userid');
  }

    toggleSidebar() {
    this.isExpandedSubject.next(!this.isExpandedSubject.value);
  }

  constructor(private http: HttpClient) {}


  Login(data:any){
    return this.http.post(this.baseurl + 'Auth/AdminLogin',data);
  }

  addgallery(data:any){
    return this.http.post(this.baseurl + 'Gallery/AddGallery',data)
  }

  updategallery(data:any){
    return this.http.post(this.baseurl + 'Gallery/UpdateGallery',data)
  }

  deletegallery(GalleryID:number){
    return this.http.get(this.baseurl + `Gallery/DeleteGallery?GalleryID=${GalleryID}`)
  }

  getallgallery(){
    return this.http.get(this.baseurl + 'Gallery/GetAllGallery')
  }

  addslider(data:any){
    return this.http.post(this.baseurl + 'Slider/AddSlider',data)
  }

  getallslider(){
    return this.http.get(this.baseurl + 'Slider/GetAllSlider')
  }

  updateslider(data:any){
    return this.http.post(this.baseurl + 'Slider/UpdateSlider',data)
  }

  deleteslider(SliderID:number){
    return this.http.get(this.baseurl + `Slider/DeleteSlider?SliderID=${SliderID}`)
  }

  addUser(data:any){
    return this.http.post(this.baseurl + 'Auth/AddNewUser',data);
  }

  updateUser(data:any){
    return this.http.post(this.baseurl + 'Auth/UpdateUser',data);
  }

  getusermanagement(data:any){
    return this.http.post(this.baseurl + 'Admin/FetchUserList',data)
  }

  changeuserstatus(UserID:number,AdminUserID:number,UserStatus:any){
    return this.http.get(this.baseurl + `Admin/ChangeUserStatus?UserID=${UserID}&AdminUserID=${AdminUserID}&UserStatus=${UserStatus}`)
  }

  changeuserpassword(data:any){
    return this.http.post(this.baseurl + 'Admin/ChangeUserPassword',data)
  }

  addride(data:any){
    return this.http.post(this.baseurl + 'Ride/AddRide',data)
  }

  fetchridelist(PageCount:number,PageSize:number){
    return this.http.get(this.baseurl + `Admin/FetchRideList?PageCount=${PageCount}&PageSize=${PageSize}`)
  }

  updateride(data:any){
    return this.http.post(this.baseurl + 'Ride/UpdateRide',data)
  }

  deleteride(rideID:number){
    return this.http.get(this.baseurl + `Ride/DeleteRide?RideID=${rideID}`)
  }

  addevent(data:any){
    return this.http.post(this.baseurl + 'Event/AddEvent',data)
  }

  updateevent(data:any){
    return this.http.post(this.baseurl + 'Event/UpdateEvent',data)
  }

  fetcheventlist(PageCount:number,PageSize:number){
    return this.http.get(this.baseurl + `Admin/FetchEventLists?PageCount=${PageCount}&PageSize=${PageSize}`)
  }

  deleteeventid(EventID:number){
    return this.http.get(this.baseurl + `Event/DeleteEvent?EventID=${EventID}`)
  }

  addteammember(data:any){
    return this.http.post(this.baseurl + 'Admin/AddCoreTeamMember',data);
  }

  getallteam(){
    return this.http.get(this.baseurl + 'Admin/GetAllCoreTeamMembers')
  }

  deleteteam(CoreTeamMemberID:number){
    return this.http.post(this.baseurl + `Admin/DeleteCoreTeamMember?CoreTeamMemberID=${CoreTeamMemberID}`,{})
  }

  updateteammember(data:any){
    return this.http.post(this.baseurl + 'Admin/UpdateCoreTeamMember',data);
  }

  addabout(data:any){
    return this.http.post(this.baseurl + 'Admin/AddAboutUsData',data)
  }

  getallabout(){
    return this.http.get(this.baseurl + 'Admin/GetAllAboutUsData')
  }

  deleteabout(AboutUsID:number){
    return this.http.post(this.baseurl + `Admin/DeleteAboutUsByID?AboutUsID=${AboutUsID}`,{})
  }

  updateabout(data:any){
    return this.http.post(this.baseurl + 'Admin/UpdateAboutUsData',data);
  }

  addridesefty(data:any){
    return this.http.post(this.baseurl + 'Ride/AddRideSafety',data)
  }

  getridesefty(){
    return this.http.get(this.baseurl + 'Ride/GetAllRideSafety')
  }

  deleteridesefty(RideSafetyID:number){
    return this.http.get(this.baseurl + `Ride/DeleteRideSafety?RideSafetyID=${RideSafetyID}`)
  }

  updateridesefty(data:any){
    return this.http.post(this.baseurl + 'Ride/UpdateRideSafety',data)
  }

  fetchuserdetails(UserID: number) {
    return this.http.get(this.baseurl + `Admin/FetchUserDetails?UserID=${UserID}`);
  }

  fetchjoinedmembers(rideID: number, joinType: number) {
    return this.http.get(this.baseurl + `Admin/FetchJoinedUsersList?ID=${rideID}&JoinType=${joinType}`);
  }

  fetchoutsiderjoiners(rideID: number, joinType: number) {
    return this.http.get(this.baseurl + `Admin/FetchOutsidersRideJoiners?ID=${rideID}&JoinType=${joinType}`);
  }

  deleteusers(JoinID:number){
    return this.http.get(this.baseurl + `Ride/DeleteUserJoin?JoinID=${JoinID}`)
  }

  getadmindashboard(userID: number) {
    return this.http.get(this.baseurl + `Admin/GetAdminDashboard?UserID=${userID}`);
  }

  addenquiry(data:any){
    return this.http.post(this.baseurl + 'Enquiry/AddEnquiry', data);
  }

  updateenquiry(data:any){
    return this.http.post(this.baseurl + 'Enquiry/UpdateEnquiry', data);
  }

  getallenquiry(data:any){
    return this.http.post(this.baseurl + 'Enquiry/GetEnquiryList', data);
  }

  deleteenquiry(EnquiryID:number){
    return this.http.get(this.baseurl + `Enquiry/DeleteEnquiry?EnquiryID=${EnquiryID}`);
  }

  addnotification(data:any){
    return this.http.post(this.baseurl + 'Notification/AddNotification',data)
  }

  getallnotification(){
    return this.http.get(this.baseurl + 'Notification/GetAllNotification')
  }

  updatenotification(data:any){
    return this.http.post(this.baseurl + 'Notification/UpdateNotification',data)
  }

  deletenotification(NotificationID:number){
    return this.http.get(this.baseurl + `Notification/DeleteNotification?NotificationID=${NotificationID}`)
  }

  getalluser(){
    return this.http.get(this.baseurl + 'Auth/GetAllUser')
  }

}
