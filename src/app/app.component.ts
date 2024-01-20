import { Component, OnInit,OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model'; //for subscribe function
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular-http-client';

  loadedPosts: Post[] = [];
  isFetching = false;
  error = '';
  private errorSub = new Subscription();

  constructor(private http: HttpClient, private postsService: PostsService) {}
  ngOnInit(): void {
    this.errorSub = this.postsService.error.subscribe((errorMessage) => {
      this.error = errorMessage;
    });

    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(
      (posts) => {
        this.isFetching = false;
        this.loadedPosts = posts;
      },
      (error) => {
        this.error = error.message;
      }
    );
  }

 

  onCreatePost(postData: Post) {
    this.postsService.createAndStorePost(postData.title, postData.content);
  }
  // onCreatePost(postData: Post) {
  //   this.http
  //     .post(
  //       'https://http-client-7ffa0-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json',
  //       postData
  //     )
  //     .subscribe((responseData) => {
  //       console.log(responseData);
  //     });
  // }

  onFetchPosts() {
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(
      (posts) => {
        this.isFetching = false;
        this.loadedPosts = posts;
      },
      (error) => {
        this.error = error.message;
        console.log(error);
      }
    );
  }

  onClearPosts() {
    this.postsService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    });
  }
  // onClearPosts() {
  //   this.http
  //     .delete(
  //       'https://http-client-7ffa0-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json'
  //     )

  //     .subscribe((responseData) => {
  //       console.log(responseData);
  //       this.loadedPosts = [];
  //     });
  // }
  // private fetchPosts() {
  //   this.isFetching=true
  //   this.http
  //     .get<{ [key: string]: Post }>(
  //       'https://http-client-7ffa0-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json'
  //     )
  //     .pipe(
  //       map((responseData) => {
  //         const postsArray: Post[] = [];
  //         for (const key in responseData) {
  //           if (responseData.hasOwnProperty(key)) {
  //             postsArray.push({ ...responseData[key], id: key });
  //           }
  //         }
  //         return postsArray;
  //       })
  //     )
  //     .subscribe((posts) => {
  //       this.loadedPosts = posts;
  //       this.isFetching=false;
  //     });
  // }

  onHandleError() {
    this.error = '';
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
}
