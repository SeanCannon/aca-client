/* eslint-disable */
import * as R from 'ramda';

import React, {
  useEffect,
  useState,
  useRef
} from 'react';

import {
  Container,
  Header,
  Segment,
  Grid,
  Image,
  Card,
  Loader
} from 'semantic-ui-react';

import { shuffleMutate } from '../../utils';
import { useInfiniteScroll, useLazyLoading } from '../../customHooks';
import { Api, ArtSvc } from '../../api';

const Gallery = () => {
  const [debounce, setDebounce]                 = useState(false);
  const [isLoading, setIsLoading]               = useState(true);
  const [isLoadingMore, setIsLoadingMore]       = useState(true);
  const [searchParams, setSearchParams]         = useState({});
  const [strategy, setStrategy]                 = useState('met');
  const [galleryItemIds, setGalleryItemIds]     = useState([]);
  const [galleryItems, setGalleryItems]         = useState([]);
  const [galleryItemCount, setGalleryItemCount] = useState(0);
  const [pageNum, setPageNum]                   = useState(1);

  const bottomBoundaryRef = useRef(null);

  const nextPageDebounced = () => {
    if (debounce) {
      return;
    }
    setDebounce(true);
    setTimeout(() => setDebounce(false), 500);

    setPageNum(pageNum + 1);
  };

  useEffect(() => {
    if (!isLoading) {
      setIsLoadingMore(true);
    }
    Promise.all(galleryItemIds.slice(pageNum * 16 - 16, pageNum * 16 + 1).map(id => {
      return ArtSvc.getItemById(Api)({ strategy, id });
    }))
      .then(images => {
        setGalleryItems([ ...galleryItems, ...images]);

        if (isLoading) {
          setIsLoading(false);
        }

        setIsLoadingMore(true);
      })
      .catch(e => {
        console.log({ e });
        return e;
      });
  }, [pageNum]);

  useLazyLoading('.ui.card', galleryItems);
  useInfiniteScroll(bottomBoundaryRef, nextPageDebounced);

  useEffect(() => {
    setIsLoading(true);
    ArtSvc.search(Api)({ strategy })
      .then(R.tap(console.log))
      .then(({ total, itemIds }) => {
        setGalleryItemCount(total);
        setGalleryItemIds(shuffleMutate(R.uniq(itemIds)));
        setPageNum(0);
      });
  }, [searchParams, strategy]);

  return (
    <Segment id="gallery" style={{ padding : '8em 0em' }} vertical>
      <Container>
        <Header as="h3" style={{ fontSize : '2em' }}>
          Gallery
        </Header>
        {
          isLoading ? <Loader content='Loading' /> : (
            <Grid>
              {
                galleryItems.map(({ id, title, primaryImageSmall }) => (
                  <Grid.Column key={id} mobile={16} tablet={8} computer={4}>
                    <Card>
                      <Image src={primaryImageSmall} wrapped ui={false} />
                      <Card.Content>
                        <Card.Header>{title}</Card.Header>
                        <Card.Meta>Courtesy of MET</Card.Meta>
                        {/*<Card.Description>*/}
                        {/*Daniel is a comedian living in Nashville.*/}
                        {/*</Card.Description>*/}
                      </Card.Content>
                      {/*<Card.Content extra>*/}
                      {/*<a>*/}
                      {/*<Icon name='user' />*/}
                      {/*10 Friends*/}
                      {/*</a>*/}
                      {/*</Card.Content>*/}
                    </Card>
                  </Grid.Column>
                ))
              }
            </Grid>
          )
        }

        { isLoading ? <Loader content='Loading' /> : null }

        <div
          id="page-bottom-boundary"
          ref={bottomBoundaryRef}
        />
      </Container>
    </Segment>
  );
};

export default Gallery;
